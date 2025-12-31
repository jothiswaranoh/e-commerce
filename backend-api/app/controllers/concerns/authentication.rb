# app/controllers/concerns/authentication.rb
module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request!
  end

  class_methods do
    def allow_unauthenticated_access(**options)
      skip_before_action :authenticate_request!, **options
    end
  end

  private

  # ---- Core Auth ----

  def authenticate_request!
    authenticate_with_token || render_unauthorized
  end

  def authenticate_with_token
    token = bearer_token
    return unless token

    session = UserSession.active.find_by_access_token(token)
    return unless session

    Current.session = session
    Current.user    = session.user
    true
  end

  # ---- Helpers ----

  def bearer_token
    auth_header = request.headers["Authorization"]
    return unless auth_header&.start_with?("Bearer ")

    auth_header.split(" ").last
  end

  def current_user
    Current.user
  end

  def current_org
    Current.org
  end

  # ---- Errors ----

  def render_unauthorized
    render json: { error: "Authentication required" }, status: :unauthorized
  end
end
