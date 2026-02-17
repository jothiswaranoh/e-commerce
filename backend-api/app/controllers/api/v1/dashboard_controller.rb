module Api
  module V1
    class DashboardController < ApplicationController
      include Authorization

      def index
        render json: {
          success: true,
          data: {
            users_count: User.count,
            products_count: Product.count,
            orders_count: Order.count,
            categories_count: Category.count
          }
        }, status: :ok
      end
    end
  end
end