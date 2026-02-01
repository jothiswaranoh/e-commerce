module Api
  module V1
    class OrdersController < ApplicationController
      def index
        orders = current_user.orders.order(created_at: :desc)
        render json: orders.map { |o| order_json(o) }
      end

      def show
        order = current_user.orders.find_by(id: params[:id])
        return render json: { success: false, error: "Order not found" }, status: :not_found unless order

        render json: order_json(order)
      end

      def create
        cart = current_user.cart
        return render json: { success: false, error: "Cart is empty" }, status: :unprocessable_entity if cart.nil? || cart.cart_items.empty?

        order = nil

        ActiveRecord::Base.transaction do
          order = current_user.orders.create!

          cart.cart_items.includes(:product).find_each do |ci|
            order.order_items.create!(
              product_id: ci.product_id,
              quantity: ci.quantity,
              unit_price: ci.product.price
            )
          end

          cart.cart_items.destroy_all
        end

        render json: order_json(order), status: :created
      end

      private

      def order_json(order)
        order.reload
        {
          id: order.id,
          status: order.status,
          created_at: order.created_at,
          items: order.order_items.includes(:product).map do |i|
            {
              product_id: i.product_id,
              name: i.product.name,
              quantity: i.quantity,
              unit_price: i.unit_price,
              line_total: i.quantity * i.unit_price
            }
          end
        }
      end
    end
  end
end
