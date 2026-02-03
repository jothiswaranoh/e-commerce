class ProductBlueprint < Blueprinter::Base
  identifier :id

  fields :org_id,
         :name,
         :slug,
         :description,
         :status,
         :category_id,
         :created_at,
         :updated_at

  association :category, blueprint: CategoryBlueprint

  field :images do |product|
    product.images.map do |image|
      Rails.application.routes.url_helpers.rails_blob_url(image)
    end
  end
end