class Organization < ApplicationRecord
  has_many :users, foreign_key: :org_id, dependent: :restrict_with_error
  has_many :categories, foreign_key: :org_id, dependent: :restrict_with_error
end