module Api
  module V1
    class CategoriesController < ApplicationController
      before_action :set_category, only: [:show, :update, :destroy]

      # GET /api/v1/categories
      def index
        categories = current_org.categories.order(:sort_order)

        render json: categories
      end

      # GET /api/v1/categories/:id
      def show
        render json: @category
      end

      # POST /api/v1/categories
      def create
        category = current_org.categories.new(category_params)

        if category.save
          render json: category, status: :created
        else
          render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
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

      # 🔐 Org-scoped lookup (NO DATA LEAKS)
      def set_category
        @category = current_org.categories.find(params[:id])
      end

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
