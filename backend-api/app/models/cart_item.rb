# app/models/cart_item.rb
class CartItem < ApplicationRecord
  belongs_to :cart
  belongs_to :product
  belongs_to :product_variant, optional: true

  validates :quantity, numericality: { greater_than: 0 }

  before_validation :set_price
  before_save :calculate_total

  private

  def set_price
    self.price ||= product_variant&.price || product.price
  end

  def calculate_total
    self.total = price.to_f * quantity.to_i
  end
end
