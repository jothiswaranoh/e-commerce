class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :name,
         :email_address,
         :role,
         :org_id,
         :created_at,
         :updated_at
end
