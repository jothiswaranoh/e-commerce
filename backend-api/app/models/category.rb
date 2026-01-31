class Category < ApplicationRecord
  belongs_to :organization, foreign_key: :org_id
  has_one_attached :image
end
