module Api
  module V1
    class CategoriesController < ApplicationController
      include Authorization
      include ResponseRenderingConcern

      load_and_authorize_resource

      # GET /api/v1/categories
      def index
        handle_response(@categories.order(:sort_order))
      end

      # GET /api/v1/categories/:id
      def show
        handle_response(@category)
      end

      # POST /api/v1/categories
      def create
        @category = Category.new(category_params)
        @category.org_id = current_user.org_id

        @category.save
        handle_response(@category, "common.created", nil, :created)
      end

      # PATCH/PUT /api/v1/categories/:id
      def update
        @category.update(category_params)
        handle_response(@category)
      end

      # DELETE /api/v1/categories/:id
      def destroy
        @category.destroy
        handle_response(nil, "common.deleted", "Category deleted successfully")
      end

      private

      def category_params
        params.require(:category).permit(
          :name,
          :slug,
          :parent_id,
          :is_active,
          :sort_order,
          :image
        )
      end
    end
  end
end