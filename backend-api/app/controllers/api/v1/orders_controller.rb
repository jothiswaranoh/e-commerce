# app/controllers/api/v1/orders_controller.rb
module Api
  module V1
    class OrdersController < ApplicationController
      include Authorization
      include ResponseRenderingConcern

      load_and_authorize_resource

      def index
        orders = Order.where(
          org_id: current_user.org_id,
          user_id: current_user.id
        ).order(created_at: :desc)

        handle_response(orders)
      end

      def create
        @order = Order.new(order_params)
        @order.org_id  = current_user.org_id
        @order.user_id = current_user.id

        unless build_items
          return handle_response(
            @order,
            "common.error",
            @order.errors.full_messages,
            :unprocessable_entity
          )
        end

        if @order.save
          handle_response(@order, "common.created", nil, :created)
        else
          handle_response(
            @order,
            "common.error",
            @order.errors.full_messages,
            :unprocessable_entity
          )
        end
      end

      private

      def order_params
        params.require(:order).permit(:tax, :shipping_fee)
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