class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[ new create refresh ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, alert: "Try again later." }

  def new
  end

  def create
    return unless authenticate_user
    generate_token_response
  end

  def destroy
    terminate_session
    redirect_to new_session_path
  end

  def refresh
    token = request.headers["Authorization"]&.split(" ")&.last
    return render_unauthorized("Token missing") unless token

    decoded = JsonWebToken.decode_for_refresh(token)
    return render_unauthorized("Invalid token format") unless decoded

    @user = User.find_by(id: decoded[:user_id])
    return render_unauthorized("User not found") unless @user

    @hospital_id = decoded[:hospital_id] if decoded[:role] == "doctor"

    generate_token_response
  end

  private

  def authenticate_user
    @user = User.find_by(email: params[:email_address] || params[:email])

    if @user.nil?
      render json: { success: false, error: "User not found" }, status: :not_found
      return false
    end

    unless @user.authenticate(params[:password])
      render json: { success: false, error: "Invalid email or password" }, status: :unauthorized
      return false
    end

    true
  end

  def render_unauthorized(message)
    render json: { success: false, error: message }, status: :unauthorized
  end

  def token_payload
    {
      user_id: @user.id,
      role: @user.roles.first&.name&.downcase || "patient",
      hospital_id: @user.respond_to?(:doctor?) && @user.doctor? ? (@hospital_id || 0) : 0,
      exp: 1.month.from_now.to_i
    }
  end

  def generate_token_response
    token = JsonWebToken.encode(token_payload)
    render json: { success: true, token: token }
  end
end
