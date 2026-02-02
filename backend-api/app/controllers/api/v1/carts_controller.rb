module Api
  module V1
    class CartsController < ApplicationController
      def show
        cart = current_user.cart || current_user.create_cart
        render json: cart_json(cart)
      end

      def add_item
        cart = current_user.cart || current_user.create_cart

        product = Product.find_by(id: params[:product_id])
        return render json: { success: false, error: "Product not found" }, status: :not_found unless product

        qty = params[:quantity].to_i
        return render json: { success: false, error: "Quantity must be >= 1" }, status: :unprocessable_entity if qty < 1

        item = cart.cart_items.find_or_initialize_by(product_id: product.id)
        item.quantity = (item.quantity || 0) + qty
        item.save!

        render json: cart_json(cart.reload), status: :ok
      end

      def update_item
        cart = current_user.cart || current_user.create_cart

        item = cart.cart_items.find_by(id: params[:id])
        return render json: { success: false, error: "Item not found" }, status: :not_found unless item

        qty = params[:quantity].to_i
        return render json: { success: false, error: "Quantity must be >= 1" }, status: :unprocessable_entity if qty < 1

        item.update!(quantity: qty)
        render json: cart_json(cart.reload), status: :ok
      end

      def remove_item
        cart = current_user.cart || current_user.create_cart

        item = cart.cart_items.find_by(id: params[:id])
        return render json: { success: false, error: "Item not found" }, status: :not_found unless item

        item.destroy
        render json: cart_json(cart.reload), status: :ok
      end

      private

def cart_json(cart)
  {
    id: cart.id,
    items: cart.cart_items.includes(:product, :product_variant).map do |item|
      {
        id: item.id,
        product_id: item.product_id,
        product_name: item.product&.name,
        quantity: item.quantity,
        price: item.price.to_f,     # ✅ from cart_items table
        total: item.total.to_f      # ✅ from cart_items table
      }
    end
  }
end
    end
  end
end
