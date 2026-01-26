class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :email, :username, :full_name, :phone, :is_active

  field :is_onboarded do |user|
    !!user.is_onboarded
  end

  field :last_login_at, datetime_format: "%Y-%m-%dT%H:%M:%S%z"
  field :confirmed_at, datetime_format: "%Y-%m-%dT%H:%M:%S%z"
  field :created_at, datetime_format: "%Y-%m-%dT%H:%M:%S%z"
  field :updated_at, datetime_format: "%Y-%m-%dT%H:%M:%S%z"

  field :role do |user|
    user.roles.first&.name || "patient"
  end

  field :patient_id do |user|
    user.patient&.id
  end

  field :subtype do |user|
    role_name = user.roles.first&.name&.downcase
    role_name || "patient"
  end


  view :extended do
    association :patient, blueprint: PatientBlueprint
    association :doctor, blueprint: DoctorBlueprint
    association :roles, blueprint: RoleBlueprint
  end
end
