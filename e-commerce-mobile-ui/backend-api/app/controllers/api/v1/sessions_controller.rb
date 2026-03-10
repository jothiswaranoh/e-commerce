module Api
  module V1
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
        handle_response(success: true, message: "Logged out successfully")
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
        @user = User.find_by(email_address: params[:email_address] || params[:email])

        if @user.nil?
          handle_response(success: false, error: "User not found", status: :not_found)
          return false
        end

        unless @user.authenticate(params[:password])
          handle_response(success: false, error: "Invalid email or password", status: :unauthorized)
          return false
        end

        true
      end

      def render_unauthorized(message)
        handle_response(success: false, error: message, status: :unauthorized)
      end

      def token_payload
        {
          user_id: @user.id,
          exp: 1.month.from_now.to_i
        }
      end

      def generate_token_response
        token = JsonWebToken.encode(token_payload)
        handle_response(success: true, data: { token: token })
      end
    end
  end
end