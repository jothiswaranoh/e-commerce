module Api
  module V1
    class CategoriesController < ApplicationController
      include Authorization
      include Crudable

      allow_unauthenticated_access only: [:index, :show]
      
      load_and_authorize_resource

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
        scope.where(org_id: current_org&.id)
      end
    end
  end
end