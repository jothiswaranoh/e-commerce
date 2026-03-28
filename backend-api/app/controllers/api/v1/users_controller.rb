module Api
  module V1
    class UsersController < ApplicationController
      include Authorization
      include Crudable

      load_and_authorize_resource except: [:me]

      # Skip Crudable's set_resource for :me
      skip_before_action :set_resource, only: [:me]
      skip_load_and_authorize_resource only: [:me]

      DEFAULT_PAGE     = 1
      DEFAULT_PER_PAGE = 10

      # -----------------------------------
      # GET /api/v1/users
      # -----------------------------------
      def index
        users = scoped_collection
                  .order(created_at: :desc)
                  .paginate(
                    page: page_param,
                    per_page: per_page_param
                  )

        render_success(
          users_response(users),
          success_response_key
        )
      end

      # -----------------------------------
      # GET /api/v1/me
      # -----------------------------------
      def me
        return render_unauthorized unless current_user
        authorize! :read, current_user

        render_success(
          UserBlueprint.render_as_json(current_user),
          success_response_key
        )
      end

      # show, create, update, destroy inherited from Crudable

      private

      # --------------------
      # Model
      # --------------------
      def model_class
        User
      end

      # --------------------
      # Strong params
      # --------------------
      def resource_params
        params.require(:user).permit(
          :name,
          :email_address,
          :phone_number,
          :password,
          :role
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
      def users_response(users)
        {
          data: UserBlueprint.render_as_json(users),
          meta: pagination_meta(users)
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

      # --------------------
      # Organization payload
      # --------------------
      def organization_payload
        return nil unless current_user&.organization

        {
          id: current_user.organization.id,
          store_name: current_user.organization.store_name,
          primary_color: current_user.organization.primary_color,
          secondary_color: current_user.organization.secondary_color,
          logo_url: current_user.organization.logo_url
        }
      end
    end
  end
end