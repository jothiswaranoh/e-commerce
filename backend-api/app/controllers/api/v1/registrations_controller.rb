module Api
  module V1
    class RegistrationsController < ApplicationController
      allow_unauthenticated_access only: :create

      def create
        role_name = params[:role].to_s.downcase || "user"
        user = User.new(registration_params)

        if user.save
          token = JsonWebToken.encode(user_id: user.id)
          render json: {
            success: true,
            token: token,
            email: user.email_address,
            role: role_name,
            message: "User registered successfully"
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def registration_params
        params.require(:user).permit(:email_address, :password, :password_confirmation, :org_id,:role)
      end
    end
  end
end



