# app/controllers/concerns/authorization.rb
module Authorization
  extend ActiveSupport::Concern

  included do
    rescue_from CanCan::AccessDenied do |_exception|
      render json: { error: "Forbidden" }, status: :forbidden
    end
  end
end