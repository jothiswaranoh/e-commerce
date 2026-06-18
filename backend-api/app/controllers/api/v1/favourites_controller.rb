module Api
  module V1
    class FavouritesController < ApplicationController
      before_action :authenticate_request!

      def index
        @favourites = current_user.favourites.includes(:product)
        render json: @favourites.map(&:product)
      end

      def create
        product = Product.find(params[:product_id])
        @favourite = current_user.favourites.find_or_create_by!(product: product, org_id: current_user.org_id)
        
        render json: { message: "Added to favourites", favourite: @favourite }, status: :created
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Product not found" }, status: :not_found
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      def destroy
        @favourite = current_user.favourites.find_by(product_id: params[:product_id])
        
        if @favourite
          @favourite.destroy
          render json: { message: "Removed from favourites" }, status: :ok
        else
          render json: { error: "Favourite not found" }, status: :not_found
        end
      end
    end
  end
end
