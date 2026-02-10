module Api
  module V1
    class CategoriesController < ApplicationController
      include Authorization
      include Crudable

      allow_unauthenticated_access only: %i[index show]
      load_and_authorize_resource

      DEFAULT_PAGE     = 1
      DEFAULT_PER_PAGE = 10

      def index
        categories = scoped_collection
                       .includes(:products)
                       .order(updated_at: :desc)
                       .paginate(
                         page: page_param,
                         per_page: per_page_param
                       )

        render_success(
          categories_response(categories),
          success_response_key
        )
      end

      private

      # --------------------
      # Model
      # --------------------
      def model_class
        Category
      end

      # --------------------
      # Strong params
      # --------------------
      def resource_params
        params.require(:category).permit(
          :name,
          :slug,
          :parent_id,
          :is_active,
          :sort_order,
          :image
        )
      end

      # --------------------
      # Query scope
      # --------------------
      def scoped_collection
        scope = model_class.all
        return scope unless current_user

        scope.where(org_id: current_org.id)
      end

      # --------------------
      # Pagination helpers
      # --------------------
      def page_param
        params.fetch(:page, DEFAULT_PAGE)
      end

      def per_page_param
        params.fetch(:per_page, DEFAULT_PER_PAGE)
      end

      # --------------------
      # Response helpers
      # --------------------
      def categories_response(categories)
        {
          data: CategoryBlueprint.render_as_json(categories),
          meta: pagination_meta(categories)
        }
      end

      def pagination_meta(collection)
        {
          current_page: collection.current_page,
          per_page: collection.per_page,
          total_pages: collection.total_pages,
          total_count: collection.total_entries
        }
      end
    end
  end
end
