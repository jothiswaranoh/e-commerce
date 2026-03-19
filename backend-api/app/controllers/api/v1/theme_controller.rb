class Api::V1::ThemeController < ApplicationController
  allow_unauthenticated_access

  def show
    org = Organization.find_by(slug: request.headers["X-Org-Slug"])
    return render json: { error: "Organization not found" }, status: :not_found unless org

    render json: {
      store_name: org.store_name || org.name,
      primary_color: org.primary_color || "#7c3aed",
      secondary_color: org.secondary_color || "#ede9fe",
      logo_url: org.logo_url
    }
  end
end