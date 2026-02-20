class ProductVariant < ApplicationRecord
  belongs_to :product
  has_many :order_items
  
  validates :sku, presence: true, uniqueness: true
  validates :price, presence: true
  validates :price,numericality: { greater_than_or_equal_to: 0 },
          if: -> { price.present? }
  validates :stock, presence: true
  validates :stock,numericality: {only_integer: true,greater_than_or_equal_to: 0},
          if: -> { stock.present? }
end
