module Api
  module V1
    class OrdersController < ApplicationController
      include Authorization
      include ResponseRenderingConcern

      load_and_authorize_resource

      # GET /api/v1/orders
      def index
        orders = @orders.where(org_id: current_user.org_id)
                        .order(created_at: :desc)

        handle_response(orders)
      end

      # GET /api/v1/orders/:id
      def show
        handle_response(@order)
      end

      # POST /api/v1/orders
      def create
        @order = Order.new(order_params)
        @order.org_id  = current_user.org_id
        @order.user_id = current_user.id

        if build_items(@order) && @order.save
          handle_response(@order, "common.created", nil, :created)
        else
          handle_response(@order, "common.error", @order.errors.full_messages, :unprocessable_entity)
        end
      end

      # PATCH /api/v1/orders/:id
      def update
        @order.update(order_params)
        handle_response(@order)
      end

      # DELETE /api/v1/orders/:id
      def destroy
        @order.destroy
        handle_response(nil, "common.deleted", "Order deleted successfully")
      end

      private

      def order_params
        params.require(:order).permit(
          :status,
          :payment_status,
          :tax,
          :shipping_fee
        )
      end

      def build_items(order)
        return order.errors.add(:base, "Items required") && false if params[:items].blank?

        params[:items].each do |i|
          order.order_items.build(
            product_id: i[:product_id],
            quantity: i[:quantity]
          )
        end
        true
      end
    end
  end
end
