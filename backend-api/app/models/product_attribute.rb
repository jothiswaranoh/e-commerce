class ProductAttribute < ApplicationRecord
  belongs_to :product

  validates :key, presence: true
  validates :value, presence: true
end
