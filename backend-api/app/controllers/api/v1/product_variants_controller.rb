module Api
  module V1
    class ProductVariantsController < ApplicationController
      include Authorization
      include ResponseRenderingConcern

      before_action :set_product
      before_action :set_variant, only: [:show, :update, :destroy]

      load_and_authorize_resource :product
      load_and_authorize_resource :variant, through: :product

      def index
        render_success(@product.variants)
      end

      def show
        render_success(@variant)
      end

      def create
        variant = @product.variants.new(variant_params)

        if variant.save
          render_success(variant, "common.created", nil, :created)
        else
          handle_response(variant)
        end
      end

      def update
        if @variant.update(variant_params)
          render_success(@variant, "common.updated")
        else
          handle_response(@variant)
        end
      end

      def destroy
        @variant.destroy
        render_success(nil, "common.deleted")
      end

      private

      def set_product
        @product = Product.accessible_by(current_ability).find(params[:product_id])
      end

      def set_variant
        @variant = @product.variants.find(params[:id])
      end

      def variant_params
        params.require(:variant).permit(:name, :price, :stock)
      end
    end
  end
end