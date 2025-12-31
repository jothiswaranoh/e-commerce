module Api
  module V1
    class UsersController < ApplicationController
      def show
        render json: { user: Current.user }
      end
    end
  end
end
