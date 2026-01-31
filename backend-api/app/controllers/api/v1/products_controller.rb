module Api
  module V1
    class ProductsController < ApplicationController
      before_action :set_product, only: [:show, :update, :destroy]

      # GET /api/v1/products
      def index
        products = current_org.products.includes(:variants, :product_attributes, :category)
        render json: products, include: [:variants, :product_attributes, :category]
      end

      # GET /api/v1/products/:id
      def show
        render json: @product, include: [:variants, :product_attributes, :category]
      end

      # POST /api/v1/products
      def create
        product = current_org.products.new(product_params)

        if product.save
          render json: product, include: [:variants, :product_attributes], status: :created
        else
          render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/products/:id
      def update
        if @product.update(product_params)
          render json: @product, include: [:variants, :product_attributes]
        else
          render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/products/:id
      def destroy
        @product.destroy
        head :no_content
      end

      private

      def set_product
        @product = current_org.products.find(params[:id])
      end

      def product_params
        params.require(:product).permit(
          :name,
          :slug,
          :description,
          :status,
          :category_id,
          variants_attributes: [:id, :sku, :price, :stock, :_destroy],
          product_attributes_attributes: [:id, :key, :value, :_destroy]
        )
      end
    end
  end
end
