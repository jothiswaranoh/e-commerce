class UserRoleBlueprint < Blueprinter::Base
  identifier :id

  field :created_at, datetime_format: "%Y-%m-%dT%H:%M:%S%z"
  field :updated_at, datetime_format: "%Y-%m-%dT%H:%M:%S%z"
  view :extended do
    association :user, blueprint: UserBlueprint
  end
end
