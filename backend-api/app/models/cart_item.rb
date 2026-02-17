class CartItem < ApplicationRecord
  belongs_to :cart
  belongs_to :product
  belongs_to :product_variant

  validates :quantity, numericality: { greater_than: 0 }

  before_validation :set_price
  before_save :calculate_total

  private

  def set_price
    # Ensure we use the variant's price.
    # If for some reason product_variant is nil (legacy?), we might need a fallback,
    # but strictly speaking a variant is required for price now.
    self.price = product_variant.price
  end

  def calculate_total
    self.total = price.to_f * quantity.to_i
  end
end
