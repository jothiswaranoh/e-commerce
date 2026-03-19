class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :name,
         :email_address,
         :phone_number,
         :role,
         :org_id,
         :created_at,
         :updated_at

  field :organization do |user|
    org = user.organization
    next nil unless org

    {
      id: org.id,
      store_name: org.store_name,
      primary_color: org.primary_color,
      secondary_color: org.secondary_color,
      logo_url: org.logo_url
    }
  end
end