class CategoryBlueprint < Blueprinter::Base
  identifier :id

  fields :org_id, :name, :slug, :parent_id, :is_active, :sort_order,
         :created_at, :updated_at

  field :image_url do |category|
    if category.image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(category.image)
    end
  end
end