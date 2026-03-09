# 🛒 eCommerce Application

Dockerized full-stack eCommerce application.

Stack:
- Backend: Ruby on Rails
- Frontend: React (Vite)
- Database: PostgreSQL
- Containers: Docker & Docker Compose

The project uses separate containers for development and production.

---

# 📦 Project Structure

.
├── backend/
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
├── web-app/
├── docker-compose.yml
├── docker-compose.prod.yml
└── .devcontainer/

---

# 🧑‍💻 Local Development (Dev Containers)

Development uses:
- Dockerfile.dev
- docker-compose.yml
- VS Code Dev Containers

## Prerequisites

- Docker installed
- VS Code installed
- Dev Containers extension

## Start Development

Option 1 (Recommended - VS Code Dev Container):
1. Open project in VS Code
2. Click “Reopen in Container”

Option 2 (Docker CLI):

docker compose up --build

## First-Time Database Setup

docker compose exec backend rails db:create
docker compose exec backend rails db:migrate
docker compose exec backend rails db:seed

## Access (Development)

Frontend: http://localhost:5173  
Backend: http://localhost:3000  
Database: localhost:5433  

Stop:

docker compose down

---

# 🏭 Production Setup (Prod Containers)

Production uses:
- Dockerfile.prod
- docker-compose.prod.yml
- Rails in production mode
- Optimized images (no dev tools, no hot reload)

## Required Environment Variables (Backend)

RAILS_ENV=production  
SECRET_KEY_BASE=<generated_secret>  
DATABASE_URL=<production_database_url>  

Generate secret:

docker compose exec backend rails secret

## Frontend Production Environment

VITE_API_URL=https://your-domain.com/api/v1

## Build Production Images

docker compose -f docker-compose.prod.yml build

## Start Production Containers

docker compose -f docker-compose.prod.yml up -d

## Run Migrations After Deployment

docker compose -f docker-compose.prod.yml exec backend rails db:migrate

---

# 📊 Logs

Development:

docker compose logs -f

Production:

docker compose -f docker-compose.prod.yml logs -f

---

# 🚀 Deployment Notes

- Always use docker-compose.prod.yml for production
- Do NOT run development containers in production
- Run database migrations after every deployment
- Ensure environment variables are configured before startup
- Use HTTPS in production