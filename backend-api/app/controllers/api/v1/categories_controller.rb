module Api
  module V1
    class CategoriesController < ApplicationController
        include Authorization
        load_and_authorize_resource

      # GET /api/v1/categories
      def index
        render json: @categories.order(:sort_order)
      end

      # GET /api/v1/categories/:id
      def show
        render json: @category
      end

      # POST /api/v1/categories
      def create
        @category.org_id = current_user.org_id

        if @category.save
          render json: @category, status: :created
        else
          render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/categories/:id
      def update
        if @category.update(category_params)
          render json: @category
        else
          render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/categories/:id
      def destroy
        @category.destroy
        head :no_content
      end

      private

      def category_params
        params.require(:category).permit(
          :name,
          :slug,
          :parent_id,
          :is_active,
          :sort_order
        )
      end
    end
  end
end