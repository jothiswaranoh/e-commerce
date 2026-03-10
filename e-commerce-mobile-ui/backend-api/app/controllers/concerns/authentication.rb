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

    payload = JsonWebToken.decode(token)
    return unless payload

    Current.user = User.find_by(id: payload[:user_id])
    return unless Current.user

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
    Current.user.organization
  end

  # ---- Errors ----

  def render_unauthorized
    render json: { error: "Authentication required" }, status: :unauthorized
  end
end
