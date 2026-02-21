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

      def update
        product = model_class.find(params[:id])

        # Attach new images manually (append instead of replace)
        if resource_params[:images].present?
          resource_params[:images].each do |img|
            product.images.attach(img)
          end
        end

        # Update everything except images
        if product.update(resource_params.except(:images))
          render_success(
            ProductBlueprint.render_as_json(product),
            success_response_key
          )
        else
          render_error(
            "common.operation_failed",
            product.errors.full_messages,
            :unprocessable_entity
          )
        end
      end

      # ✅ SAFE DESTROY (FIXED)
      def destroy
        product = scoped_collection.find(params[:id])

        # Business rule: prevent deletion if active orders exist
        if product.variants.joins(:order_items).exists?
          return render_error(
            "common.operation_failed",
            "Cannot delete product with active orders",
            :unprocessable_entity
          )
        end

        if product.destroy
          render_success({}, success_response_key)
        else
          render_error(
            "common.operation_failed",
            product.errors.full_messages,
            :unprocessable_entity
          )
        end
      end

      private

      def model_class
        Product
      end

      def resource_params
        params.require(:product).permit(
          :name,
          :slug,
          :category_id,
          :status,
          :description,
          images: [],
          variants_attributes: [
            :id,
            :name,
            :sku,
            :price,
            :stock,
            :is_active,
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