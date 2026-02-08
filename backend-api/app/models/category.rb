class Category < ApplicationRecord
  belongs_to :organization, foreign_key: :org_id

  # if you have nested categories:
  belongs_to :parent, class_name: "Category", optional: true
  has_many :children, class_name: "Category", foreign_key: :parent_id, dependent: :nullify
  has_one_attached :image
  has_many :products, dependent: :nullify
end
