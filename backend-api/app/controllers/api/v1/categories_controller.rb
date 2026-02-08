module Api
  module V1
    class CategoriesController < ApplicationController
      include Authorization
      include Crudable

      allow_unauthenticated_access only: [:index, :show]
      load_and_authorize_resource

      def index
        categories = scoped_collection
                       .includes(:products) # ✅ IMPORTANT
                       .paginate(
                         page: params[:page] || 1,
                         per_page: params[:per_page] || 10
                       )

        render_success(
          {
            data: CategoryBlueprint.render_as_json(categories),
            meta: {
              current_page: categories.current_page,
              per_page: categories.per_page,
              total_pages: categories.total_pages,
              total_count: categories.total_entries
            }
          },
          success_response_key
        )
      end

      private

      def model_class
        Category
      end

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

      def scoped_collection
        scope = model_class.all
        return scope unless current_user
        scope.where(org_id: current_org.id)
      end
    end
  end
end