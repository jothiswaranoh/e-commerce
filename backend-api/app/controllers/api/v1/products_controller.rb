module Api
  module V1
    class ProductsController < ApplicationController
      include Authorization
      include ResponseRenderingConcern
      include Crudable

      allow_unauthenticated_access only: [:index, :show]
      before_action :authenticate_request!, except: [:index, :show]

      authorize_resource

      private

      def model_class
        Product
      end

      def resource_params
        params.require(:product).permit(
          :name,
          :slug,
          :description,
          :status,
          :category_id,
          images: [],
          variants_attributes: [:id, :sku, :price, :stock, :_destroy],
          product_attributes_attributes: [:id, :key, :value, :_destroy]
        )
      end

      def scoped_collection
        scope = model_class.all
        scope = scope.includes(:variants, :product_attributes, :category)

        return scope unless current_user

        scope.where(org_id: current_org.id)
      end
    end
  end
end