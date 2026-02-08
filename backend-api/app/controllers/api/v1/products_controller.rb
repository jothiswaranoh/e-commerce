module Api
  module V1
    class ProductsController < ApplicationController
      include Authorization
      include Crudable

      allow_unauthenticated_access only: [:index, :show]
      load_and_authorize_resource

      def index
        products = scoped_collection
                     .paginate(
                       page: params[:page] || 1,
                       per_page: params[:per_page] || 10
                     )

        render_success(
          {
            data: ProductBlueprint.render_as_json(products),
            meta: {
              current_page: products.current_page,
              per_page: products.per_page,
              total_pages: products.total_pages,
              total_count: products.total_entries
            }
          },
          success_response_key
        )
      end

      private

      def model_class
        Product
      end

      # ✅ THIS IS WHAT WAS MISSING
      def resource_params
  params.require(:product).permit(
    :name,
    :slug,
    :category_id,
    :status,
    :description,
    images: [], # 👈 THIS IS THE KEY
    variants_attributes: [
      :id,
      :sku,
      :price,
      :stock,
      :_destroy
    ]
  )
end

      def scoped_collection
        scope = model_class
                  .includes(:variants, :category)
                  .order(created_at: :desc)

        return scope unless current_user
        scope.where(org_id: current_org.id)
      end
    end
  end
end