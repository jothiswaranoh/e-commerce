# app/controllers/api/v1/orders_controller.rb
module Api
  module V1
    class OrdersController < ApplicationController
      include Authorization
      include ResponseRenderingConcern

      load_and_authorize_resource

      def index
        orders = Order.accessible_by(current_ability)
                      .includes(:user, order_items: :product)
                      .order(created_at: :desc)
                      .paginate(page: params[:page] || 1, per_page: params[:per_page] || 10)

        render_success(
          {
            data: OrderBlueprint.render_as_json(orders),
            meta: {
              current_page: orders.current_page,
              per_page: orders.per_page,
              total_pages: orders.total_pages,
              total_count: orders.total_entries
            }
          }
        )
      end

      def show
        render_success(OrderBlueprint.render_as_json(@order))
      end

      def create
        @order = Order.new(order_params)
        @order.org_id  = current_user.org_id
        @order.user_id = current_user.id

        unless build_items
          return handle_response(@order)
        end

        if @order.save
          render_success(OrderBlueprint.render_as_json(@order), "common.created", nil, :created)
        else
          handle_response(@order)
        end
      end

      def update
        if @order.update(update_params)
          render_success(OrderBlueprint.render_as_json(@order), "common.updated")
        else
          handle_response(@order)
        end
      end

      private

      def order_params
        params.require(:order).permit(:tax, :shipping_fee)
      end

      def update_params
        params.require(:order).permit(:status, :payment_status)
      end

      def build_items
        items = params[:items]

        if items.blank?
          @order.errors.add(:base, "Items required")
          return false
        end

        items.each do |item|
          product = Product.find_by(id: item[:product_id])
          return false unless product

          variant = product.variants.first
          return false unless variant

          @order.order_items.build(
            product_id: product.id,
            product_variant_id: variant.id,
            price: variant.price,
            quantity: item[:quantity]
          )
        end

        true
      end
    end
  end
end