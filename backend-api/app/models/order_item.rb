class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product
  belongs_to :product_variant, optional: true

  before_save :set_total

  private

  def set_total
    self.total = price.to_f * quantity.to_i
  end
end
