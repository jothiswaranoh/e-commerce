class ProductVariant < ApplicationRecord
  belongs_to :product
  has_many :order_items, dependent: :destroy
  has_many :cart_items, dependent: :destroy
  
  validates :sku, presence: true, uniqueness: true, unless: :marked_for_destruction?
  validates :price, presence: true, unless: :marked_for_destruction?
  validates :price,numericality: { greater_than_or_equal_to: 0 },
          if: -> { price.present? && !marked_for_destruction? }
  validates :stock, presence: true, unless: :marked_for_destruction?
  validates :stock,numericality: {only_integer: true,greater_than_or_equal_to: 0},
          if: -> { stock.present? && !marked_for_destruction? }
end
