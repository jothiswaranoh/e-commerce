module Api
  module V1
    class DashboardController < ApplicationController
      include Authorization
      include Crudable   # ✅ THIS WAS MISSING

      def index
        render_success(
          {
            users_count: User.count,
            products_count: Product.count,
            orders_count: Order.count,
            categories_count: Category.count
          },
          success_response_key
        )
      end
    end
  end
end