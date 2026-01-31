class Product < ApplicationRecord
  belongs_to :org, class_name: 'Organization'
  belongs_to :category

  has_many :variants, class_name: 'ProductVariant', dependent: :destroy
  has_many :product_attributes, class_name: 'ProductAttribute', dependent: :destroy

  accepts_nested_attributes_for :variants, allow_destroy: true
  accepts_nested_attributes_for :product_attributes, allow_destroy: true

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: { scope: :org_id, message: "should be unique within the organization" }
  validates :org_id, presence: true
  validates :category_id, presence: true
  validates :status, inclusion: { in: %w[active inactive archived], message: "%{value} is not a valid status" }
end
