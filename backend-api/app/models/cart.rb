# app/models/cart.rb
class Cart < ApplicationRecord
  belongs_to :organization, foreign_key: :org_id
  belongs_to :user
  has_many :cart_items, dependent: :destroy

  validates :user_id, uniqueness: { scope: :org_id }

  def subtotal
    cart_items.sum(:total)
  end

  def clear!
    cart_items.destroy_all
  end
end
