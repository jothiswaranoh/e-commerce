class Category < ApplicationRecord
  belongs_to :organization, foreign_key: :org_id
  has_one_attached :image

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: { scope: :org_id }
end
