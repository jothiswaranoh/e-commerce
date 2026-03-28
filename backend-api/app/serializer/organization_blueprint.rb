class OrganizationBlueprint < Blueprinter::Base
  identifier :id

  fields :name,
         :store_name,
         :slug,
         :logo_url,
         :primary_color,
         :secondary_color,
         :support_email,
         :support_phone,
         :is_active
end