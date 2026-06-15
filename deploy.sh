#!/usr/bin/env bash

# Strict mode
set -Eeuo pipefail

########################################
# Configuration
########################################

APP_NAME="ecommerce"
APP_DIR="/home/ubuntu/e-commerce"
BRANCH="zilvo"
DOMAIN="https://zilvo.ddns.net"
HEALTH_ENDPOINT="/api/v1/products"
LOG_FILE="${APP_DIR}/deploy.log"

########################################
# Logging
########################################

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $1" | tee -a "$LOG_FILE"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1" | tee -a "$LOG_FILE" >&2
}

########################################
# Error Handling
########################################

handle_failure() {
    error "Deployment failed at line $1"
    error "Existing containers remain active"
    log "Container status:"
    $COMPOSE ps || true
    exit 1
}

# Trap errors and run failure handler
trap 'handle_failure $LINENO' ERR

########################################
# Dependency Checks
########################################

check_dependencies() {
    command -v git >/dev/null 2>&1 || {
        error "Git is not installed"
        exit 1
    }

    command -v docker >/dev/null 2>&1 || {
        error "Docker is not installed"
        exit 1
    }

    command -v curl >/dev/null 2>&1 || {
        error "curl is not installed"
        exit 1
    }

    if docker compose version >/dev/null 2>&1; then
        COMPOSE="docker compose -f docker-compose.prod.yml"
    elif command -v docker-compose >/dev/null 2>&1; then
        COMPOSE="docker-compose -f docker-compose.prod.yml"
    else
        error "Docker Compose is not installed"
        exit 1
    fi
}

########################################
# Setup Environment & Domain Configs
########################################

setup_env() {
    log "Checking environment file..."
    ENV_FILE="${APP_DIR}/.env"
    if [ ! -f "$ENV_FILE" ]; then
        log "Generating production environment file (.env)..."
        DATABASE_PASS=$(openssl rand -hex 16)
        SECRET_KEY_BASE=$(openssl rand -hex 64)
        
        cat > "$ENV_FILE" <<EOF
DATABASE_USER=postgres
DATABASE_PASSWORD=$DATABASE_PASS
SECRET_KEY_BASE=$SECRET_KEY_BASE
EOF
        log "Created .env file with secure generated secrets."
    else
        log ".env file already exists."
    fi
}

update_domain_configs() {
    log "Updating configuration files with the correct domain ($DOMAIN)..."
    CLEAN_DOMAIN=$(echo "$DOMAIN" | sed -e 's|^[^/]*//||' -e 's|/.*||')
    
    # Update nginx.server.conf
    if [ -f "nginx.server.conf" ]; then
        sed -i "s/looksmen.freedynamicdns.org/${CLEAN_DOMAIN}/g" nginx.server.conf
    fi
    
    # Update web-app/.env.production
    if [ -f "web-app/.env.production" ]; then
        sed -i "s/looksmen.freedynamicdns.org/${CLEAN_DOMAIN}/g" web-app/.env.production
    fi
    
    # Update Rails production config
    if [ -f "backend-api/config/environments/production.rb" ]; then
        sed -i "s/looksmen.freedynamicdns.org/${CLEAN_DOMAIN}/g" backend-api/config/environments/production.rb
    fi
    log "Domain name configurations updated successfully."
}

########################################
# Setup SSL Certificates
########################################

setup_ssl() {
    log "Checking SSL certificates..."
    CLEAN_DOMAIN=$(echo "$DOMAIN" | sed -e 's|^[^/]*//||' -e 's|/.*||')
    CERT_DIR="/etc/letsencrypt/live/${CLEAN_DOMAIN}"
    FULLCHAIN="${CERT_DIR}/fullchain.pem"
    PRIVKEY="${CERT_DIR}/privkey.pem"

    if sudo test -f "$FULLCHAIN" && sudo test -f "$PRIVKEY" && sudo openssl x509 -in "$FULLCHAIN" -noout -issuer 2>/dev/null | grep -qi "Let's Encrypt"; then
        log "SSL Certificates already exist for ${CLEAN_DOMAIN} and are valid Let's Encrypt certificates. Skipping generation."
    else
        log "SSL Certificates not found or are a self-signed fallback. Attempting Let's Encrypt generation..."
        
        # Stop Nginx if running to free port 80
        log "Stopping frontend container to free port 80..."
        $COMPOSE down || true
        
        log "Starting standalone Certbot container..."
        set +e
        sudo docker run --rm --name certbot \
          -p 80:80 \
          -v "/etc/letsencrypt:/etc/letsencrypt" \
          -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
          certbot/certbot certonly \
          --standalone \
          -d "${CLEAN_DOMAIN}" \
          --non-interactive \
          --agree-tos \
          --email "webmaster@${CLEAN_DOMAIN}" \
          --cert-name "${CLEAN_DOMAIN}" \
          --key-type ecdsa
        CERT_STATUS=$?
        set -e
        
        if [ $CERT_STATUS -eq 0 ] && sudo test -f "$FULLCHAIN"; then
            log "Successfully obtained Let's Encrypt SSL certificate!"
        else
            log "Warning: Let's Encrypt certificate acquisition failed."
            if ! sudo test -f "$FULLCHAIN" || ! sudo test -f "$PRIVKEY"; then
                log "Generating a self-signed fallback certificate so Nginx can start successfully..."
                sudo mkdir -p "$CERT_DIR"
                sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                  -keyout "$PRIVKEY" \
                  -out "$FULLCHAIN" \
                  -subj "/CN=${CLEAN_DOMAIN}"
                log "Self-signed fallback certificate created successfully."
            else
                log "Reusing existing fallback certificate."
            fi
        fi
    fi
}

########################################
# Wait For Containers
########################################

wait_for_containers() {
    log "Waiting for containers to become healthy..."

    for i in {1..30}; do
        unhealthy=$($COMPOSE ps --format json 2>/dev/null | grep -c unhealthy || true)

        if [ "$unhealthy" -eq 0 ]; then
            log "Containers are healthy"
            return 0
        fi

        sleep 5
    done

    error "Container health checks failed"
    exit 1
}

########################################
# Database Connectivity & Setup Check
########################################

check_database() {
    log "Checking Rails database connectivity..."

    if ! $COMPOSE exec -T backend \
        ./bin/rails runner \
        "ActiveRecord::Base.connection.active?" \
        >/dev/null 2>&1; then

        error "Database connectivity check failed"
        exit 1
    fi

    log "Database connectivity verified"
}

setup_database() {
    log "Preparing Rails database and running migrations..."
    $COMPOSE exec -T backend ./bin/rails db:prepare
    
    log "Running database seed to populate default catalogs and roles..."
    $COMPOSE exec -T backend ./bin/rails db:seed
}

########################################
# API Readiness Check
########################################

check_api() {
    log "Checking API readiness endpoint..."
    CLEAN_DOMAIN=$(echo "$DOMAIN" | sed -e 's|^[^/]*//||' -e 's|/.*||')

    for i in {1..20}; do
        # Use localhost bypass resolving to prevent loopback/firewall lookup failure
        if curl -k -fsS "${DOMAIN}${HEALTH_ENDPOINT}" --resolve "${CLEAN_DOMAIN}:443:127.0.0.1" >/dev/null; then
            log "API readiness check passed"
            return 0
        fi

        sleep 3
    done

    error "API readiness check failed"
    exit 1
}

########################################
# Cleanup
########################################

cleanup() {
    log "Cleaning unused Docker images..."
    docker image prune -f >/dev/null 2>&1 || true
}

########################################
# Restart Services
########################################

restart_services() {
    log "Reloading Docker Nginx configuration..."
    $COMPOSE exec -T frontend nginx -s reload
    log "Nginx configuration reloaded successfully"
}

########################################
# Deployment
########################################

deploy() {
    log "Changing directory to ${APP_DIR}"
    cd "$APP_DIR"

    log "Fetching latest source code..."
    git fetch origin "$BRANCH"

    log "Pulling latest changes..."
    # If there are local changes (like auto-domain modifications), stash them and pop after pulling
    if ! git diff-index --quiet HEAD --; then
        log "Stashing local changes..."
        git stash
        git pull origin "$BRANCH"
        log "Applying local configurations..."
        git stash pop || true
    else
        git pull origin "$BRANCH"
    fi

    setup_env
    update_domain_configs
    setup_ssl

    log "Building and starting updated containers..."
    $COMPOSE up -d --build

    wait_for_containers
    setup_database
    check_database
    check_api
    cleanup
    restart_services

    log "Deployment completed successfully"
}

########################################
# Menu Interface
########################################

# ANSI Color Codes
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_menu() {
    clear 2>/dev/null || true
    echo -e "${CYAN}======================================================================${NC}"
    echo -e "          ${GREEN}🚀  Ecommerce App Management & Deployment CLI  🚀${NC}"
    echo -e "${CYAN}======================================================================${NC}"
    echo -e "  [${GREEN}1${NC}] Run Full Deployment (Pull code, setup env/SSL, build & start, DB migrations)"
    echo -e "  [${GREEN}2${NC}] Pull Latest Source Code & Update Domain Configs"
    echo -e "  [${GREEN}3${NC}] Setup / Renew SSL Certificates (Let's Encrypt)"
    echo -e "  [${GREEN}4${NC}] Build & Start Docker Containers"
    echo -e "  [${GREEN}5${NC}] Prepare & Seed Rails Database"
    echo -e "  [${GREEN}6${NC}] Check Database Connectivity"
    echo -e "  [${GREEN}7${NC}] Run API Readiness / Health Check"
    echo -e "  [${GREEN}8${NC}] Reload Nginx Configuration"
    echo -e "  [${GREEN}9${NC}] Clean Unused Docker Images"
    echo -e "  [${GREEN}10${NC}] View/Tail Deployment Logs"
    echo -e "  [${GREEN}11${NC}] Show Container Status"
    echo -e "  [${RED}0${NC}] Exit"
    echo -e "${CYAN}======================================================================${NC}"
}

interactive_menu() {
    # Disable exit-on-error inside interactive loop to prevent accidental exits
    set +e
    while true; do
        show_menu
        read -rp "Enter your choice [0-11]: " choice
        echo ""
        
        case "$choice" in
            1)
                log "Starting full deployment..."
                set -e
                deploy
                set +e
                ;;
            2)
                log "Pulling latest code and updating domain configurations..."
                set -e
                cd "$APP_DIR"
                git fetch origin "$BRANCH"
                if ! git diff-index --quiet HEAD --; then
                    log "Stashing local changes..."
                    git stash
                    git pull origin "$BRANCH"
                    log "Applying local configurations..."
                    git stash pop || true
                else
                    git pull origin "$BRANCH"
                fi
                setup_env
                update_domain_configs
                set +e
                ;;
            3)
                log "Running SSL setup..."
                set -e
                setup_ssl
                set +e
                ;;
            4)
                log "Building and starting Docker containers..."
                set -e
                $COMPOSE up -d --build
                wait_for_containers
                set +e
                ;;
            5)
                log "Preparing database and seeding..."
                set -e
                setup_database
                set +e
                ;;
            6)
                log "Checking database connectivity..."
                set -e
                check_database
                set +e
                ;;
            7)
                log "Checking API readiness..."
                set -e
                check_api
                set +e
                ;;
            8)
                log "Reloading Nginx config..."
                set -e
                restart_services
                set +e
                ;;
            9)
                log "Running docker cleanup..."
                set -e
                cleanup
                set +e
                ;;
            10)
                log "Showing tail of logs. Press Ctrl+C to stop..."
                tail -f -n 50 "$LOG_FILE"
                ;;
            11)
                log "Showing current container status:"
                $COMPOSE ps
                ;;
            0)
                log "Exiting. Goodbye!"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option! Please enter a number between 0 and 11.${NC}"
                ;;
        esac
        
        echo -e "\nPress [Enter] to return to the menu..."
        read -r
    done
    set -e
}

########################################
# Main
########################################

main() {
    check_dependencies
    
    # If arguments are passed, treat as a single command execution
    if [ $# -gt 0 ]; then
        case "$1" in
            deploy)
                deploy
                ;;
            pull)
                cd "$APP_DIR"
                git fetch origin "$BRANCH"
                git pull origin "$BRANCH"
                setup_env
                update_domain_configs
                ;;
            ssl)
                setup_ssl
                ;;
            build)
                $COMPOSE up -d --build
                wait_for_containers
                ;;
            db)
                setup_database
                check_database
                ;;
            check-db)
                check_database
                ;;
            check-api)
                check_api
                ;;
            reload)
                restart_services
                ;;
            cleanup)
                cleanup
                ;;
            status)
                $COMPOSE ps
                ;;
            logs)
                tail -n 50 "$LOG_FILE"
                ;;
            *)
                echo "Usage: $0 {deploy|pull|ssl|build|db|check-db|check-api|reload|cleanup|status|logs}"
                exit 1
                ;;
        esac
    else
        # Run in interactive menu mode
        interactive_menu
    fi
}

main "$@"
