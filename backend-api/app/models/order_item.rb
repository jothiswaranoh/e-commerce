# app/models/order_item.rb
class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product
  belongs_to :product_variant, optional: true

  validates :price, numericality: { greater_than: 0 }
  validates :quantity, numericality: { greater_than: 0 }

  before_validation :copy_product_name
  before_save :calculate_total

  private

  def calculate_total
    self.total = price.to_f * quantity.to_i
  end

  def copy_product_name
    self.product_name ||= product.name if product
  end
end