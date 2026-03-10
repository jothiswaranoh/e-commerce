module Api
  module V1
    class PasswordsController < ApplicationController
      allow_unauthenticated_access

      def create
        if user = User.find_by(email_address: params[:email])
          PasswordsMailer.reset(user).deliver_later
        end
        # Always return success to prevent email enumeration
        handle_response(success: true, message: "Password reset instructions sent (if user with that email address exists).")
      end

      def update
        user = User.find_by_token_for(:password_reset, params[:token])

        if user.nil?
          return handle_response(success: false, error: "Invalid or expired reset token", status: :unprocessable_entity)
        end

        if user.update(params.permit(:password, :password_confirmation))
          handle_response(success: true, message: "Password has been reset successfully.")
        else
          handle_response(success: false, error: user.errors.full_messages.join(", "), status: :unprocessable_entity)
        end
      end
    end
  end
end
