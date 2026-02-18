module Api
  module V1
    class CartsController < ApplicationController
      include ResponseRenderingConcern

      def show
        cart = find_or_create_cart
        render_success(cart_json(cart))
      end

      def add_item
        cart = find_or_create_cart

        product = Product.find_by(id: params[:product_id])
        return render_error("common.not_found", "Product not found", :not_found) unless product

        variant_id = params[:product_variant_id]
        return render_error("common.validation_error", "Variant is required", :unprocessable_entity) unless variant_id

        variant = product.variants.find_by(id: variant_id)
        return render_error("common.not_found", "Variant not found", :not_found) unless variant

        return render_error("common.operation_failed", "Out of stock", :unprocessable_entity) if variant.stock <= 0

        qty = params[:quantity].to_i
        return render_error("common.validation_error", "Quantity must be >= 1", :unprocessable_entity) if qty < 1

        item = cart.cart_items.find_or_initialize_by(
          product_id: product.id,
          product_variant_id: variant.id
        )

        new_quantity = (item.persisted? ? item.quantity : 0) + qty

        if new_quantity > variant.stock
          return render_error(
            "common.operation_failed",
            "Only #{variant.stock} items available",
            :unprocessable_entity
          )
        end

        item.quantity = new_quantity
        item.save!

        render_success(cart_json(cart.reload))
      end

      def update_item
        cart = find_or_create_cart

        id = params[:id] || params[:item_id]
        item = cart.cart_items.find_by(id: id)
        return render_error("common.not_found", "Item not found", :not_found) unless item

        qty = params[:quantity].to_i
        return render_error("common.validation_error", "Quantity must be >= 1", :unprocessable_entity) if qty < 1

        variant = item.product_variant
        return render_error("common.operation_failed", "Variant missing", :unprocessable_entity) unless variant

        if qty > variant.stock
          return render_error(
            "common.operation_failed",
            "Only #{variant.stock} items available",
            :unprocessable_entity
          )
        end

        item.update!(quantity: qty)
        render_success(cart_json(cart.reload))
      end

      def remove_item
        cart = find_or_create_cart

        id = params[:id] || params[:item_id]
        item = cart.cart_items.find_by(id: id)
        return render_error("common.not_found", "Item not found", :not_found) unless item

        item.destroy
        render_success(cart_json(cart.reload))
      end

      private

      def find_or_create_cart
        cart = current_user.cart
        unless cart
          # Ensure we link the cart to the user's organization
          cart = current_user.create_cart(organization: current_user.organization)
        end
        cart
      end

      def cart_json(cart)
        {
          id: cart.id,
          items: cart.cart_items.includes(:product, :product_variant).map do |item|
            {
              id: item.id,
              product_id: item.product_id,
              product_variant_id: item.product_variant_id,   # 🔥 THIS MUST EXIST
              product_name: item.product&.name,
              variant_name: item.product_variant&.name,
              quantity: item.quantity,
              price: item.price.to_f,
              total: item.total.to_f,
              image: (
                if item.product&.images&.attached?
                  Rails.application.routes.url_helpers.rails_blob_url(
                    item.product.images.first
                  )
                else
                  nil
                end
              )
            }
          end
        }
      end
    end
  end
end
