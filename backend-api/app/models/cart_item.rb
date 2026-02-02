class CartItem < ApplicationRecord
  belongs_to :cart
  belongs_to :product
  belongs_to :product_variant, optional: true

  validates :quantity, numericality: { greater_than: 0 }

  before_validation :set_price
  before_save :calculate_total

  private

  def set_price
    return if price.present?
    self.price = 0
  end

  def calculate_total
    self.total = price.to_f * quantity.to_i
  end
end
