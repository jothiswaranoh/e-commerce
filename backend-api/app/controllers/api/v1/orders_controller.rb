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

        ActiveRecord::Base.transaction do
          items = params[:items]

          if items.blank?
            @order.errors.add(:base, "Items required")
            raise ActiveRecord::Rollback
          end

          items.each do |item|
            product = Product.find_by(id: item[:product_id])
            unless product
              @order.errors.add(:base, "Product not found")
              raise ActiveRecord::Rollback
            end

            variant = product.variants.find_by(id: item[:product_variant_id])
            unless variant
              @order.errors.add(:base, "Variant not found")
              raise ActiveRecord::Rollback
            end

            qty = item[:quantity].to_i

            if qty < 1
              @order.errors.add(:base, "Invalid quantity")
              raise ActiveRecord::Rollback
            end

            variant.lock!

            if qty > variant.stock
              @order.errors.add(:base, "Only #{variant.stock} items available")
              raise ActiveRecord::Rollback
            end

            variant.update!(stock: variant.stock - qty)

            @order.order_items.build(
              product_id: product.id,
              product_variant_id: variant.id,
              price: variant.price,
              quantity: qty
            )
          end

          unless @order.save
            raise ActiveRecord::Rollback
          end
        end

        if @order.persisted?
          #Clear user's cart after successful order
          current_user.cart&.cart_items&.destroy_all

          render_success(
            OrderBlueprint.render_as_json(@order),
            "common.created",
            nil,
            :created
          )
        else
          handle_response(@order)
        end
      end

      def update
  new_status = update_params[:status]

  if new_status.present? && !valid_status_transition?(@order.status, new_status)
    return render_error(
      "common.operation_failed",
      "Invalid order status transition",
      :unprocessable_entity
    )
  end

  if @order.update(update_params)
    render_success(OrderBlueprint.render_as_json(@order), "common.updated")
  else
    handle_response(@order)
  end
end
      def cancel
  order = Order.accessible_by(current_ability).find(params[:id])

  unless order.status == "pending"
    return render_error(
      "common.operation_failed",
      "Order cannot be cancelled unless it is pending",
      :unprocessable_entity
    )
  end

  ActiveRecord::Base.transaction do
    order.order_items.each do |item|
      variant = item.product_variant
      next unless variant

      variant.update!(stock: variant.stock + item.quantity)
    end

    order.update!(status: "cancelled")
  end

  render_success(
  OrderBlueprint.render_as_json(order),
  "order_cancelled"
)
end
      private

      def order_params
        params.require(:order).permit(:shipping_fee)
      end

      def update_params
        params.require(:order).permit(:status, :payment_status)
      end
      def valid_status_transition?(current_status, new_status)
  allowed_transitions = {
    "pending" => ["confirmed", "cancelled"],
    "confirmed" => ["shipped", "cancelled"],
    "shipped" => ["delivered"],
    "delivered" => [],
    "cancelled" => []
  }

  allowed_transitions[current_status]&.include?(new_status)
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

          variant = product.variants.find_by(id: item[:product_variant_id])
          return false unless variant

          quantity = item[:quantity].to_i
          return false if quantity < 1

          if quantity > variant.stock
            @order.errors.add(:base, "Only #{variant.stock} items available for #{product.name}")
            return false
          end

          @order.order_items.build(
            product_id: product.id,
            product_variant_id: variant.id,
            price: variant.price,
            quantity: quantity
          )
        end

        true
      end
    end
  end
end