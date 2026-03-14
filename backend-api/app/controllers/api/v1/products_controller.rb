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

      def create
        product = model_class.new(resource_params.except(:images))
        product.org_id = current_org.id if product.respond_to?(:org_id)

        if product.save
          if resource_params[:images].present?
            resource_params[:images].each do |img|
              product.images.attach(img)
            end
          end

          product.reload

          render_success(
            ProductBlueprint.render_as_json(product),
            create_response_key,
            nil,
            :created
          )
        else
          handle_response(product)
        end
      end

      def update
        product = model_class.find(params[:id])
        delete_ids = resource_params[:delete_image_ids]

        if delete_ids.present?
          delete_ids.each do |id|
            attachment = product.images.attachments.find_by(id: id)
            attachment&.purge
          end
        end

        if product.update(resource_params.except(:images, :delete_image_ids, :image_order_ids))

          if resource_params[:image_order_ids].present?
            ordered_ids = resource_params[:image_order_ids].map(&:to_i)

            attachments = product.images.attachments.where(id: ordered_ids).index_by(&:id)

            ordered_blobs = ordered_ids.map { |id| attachments[id]&.blob }.compact

            product.images.detach

            ordered_blobs.each do |blob|
              product.images.attach(blob)
            end
          end

          if resource_params[:images].present?
            resource_params[:images].each do |img|
              product.images.attach(img)
            end
          end

          product.reload

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

        if product.variants.joins(:cart_items).exists?
          return render_error(
            "common.operation_failed",
            "Cannot delete product currently in carts",
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
          delete_image_ids: [],
          image_order_ids: [], 
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

        scope = scope.where(org_id: current_org.id) if current_user

        if params[:search].present?
          term = "%#{params[:search]}%"
          scope = scope.where("products.name ILIKE ?", term)
        end

        scope
      end
    end
  end
end