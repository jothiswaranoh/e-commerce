class CategoryBlueprint < Blueprinter::Base
  identifier :id

  fields :org_id,
         :name,
         :slug,
         :parent_id,
         :is_active,
         :sort_order,
         :created_at,
         :updated_at

  field :image_url do |category|
    next unless category.image.attached?

    Rails.application.routes.url_helpers.rails_blob_url(
      category.image,
      host: Rails.application.config.action_mailer.default_url_options[:host]
    )
  end

  # ✅ ADD THIS
  field :products_count do |category|
    category.products.size
  end
end