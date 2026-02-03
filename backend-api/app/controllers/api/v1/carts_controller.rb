module Api
  module V1
    class CartsController < ApplicationController
      def show
        cart = find_or_create_cart
        render json: cart_json(cart)
      end

      def add_item
        cart = find_or_create_cart

        product = Product.find_by(id: params[:product_id])
        return render json: { success: false, error: "Product not found" }, status: :not_found unless product

        # Determine variant: provided ID or default (first active)
        variant_id = params[:product_variant_id]
        if variant_id
          variant = product.variants.find_by(id: variant_id)
          return render json: { success: false, error: "Variant not found" }, status: :not_found unless variant
        else
          # Fallback to first active variant
          variant = product.variants.where(is_active: true).order(:id).first
          return render json: { success: false, error: "Product has no active variants" }, status: :unprocessable_entity unless variant
        end

        qty = params[:quantity].to_i
        return render json: { success: false, error: "Quantity must be >= 1" }, status: :unprocessable_entity if qty < 1

        item = cart.cart_items.find_or_initialize_by(product_id: product.id, product_variant_id: variant.id)
        
        item.quantity = (item.persisted? ? item.quantity : 0) + qty
        item.price = variant.price
        item.save!

        render json: cart_json(cart.reload), status: :ok
      end

      def update_item
        cart = find_or_create_cart

        id = params[:id] || params[:item_id]
        item = cart.cart_items.find_by(id: id)
        return render json: { success: false, error: "Item not found" }, status: :not_found unless item

        qty = params[:quantity].to_i
        return render json: { success: false, error: "Quantity must be >= 1" }, status: :unprocessable_entity if qty < 1

        item.update!(quantity: qty)
        render json: cart_json(cart.reload), status: :ok
      end

      def remove_item
        cart = find_or_create_cart

        id = params[:id] || params[:item_id]
        item = cart.cart_items.find_by(id: id)
        return render json: { success: false, error: "Item not found" }, status: :not_found unless item

        item.destroy
        render json: cart_json(cart.reload), status: :ok
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
        product_name: item.product&.name,
        variant_name: item.product_variant&.sku, # Or add a name field to variant if it exists, using SKU for now or construct a name
        quantity: item.quantity,
        price: item.price.to_f,     
        total: item.total.to_f,     
        image: item.product&.image  
      }
    end
  }
end
    end
  end
end
