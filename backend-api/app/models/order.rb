class Order < ApplicationRecord
  belongs_to :organization, foreign_key: :org_id
  belongs_to :user
  has_many :order_items, dependent: :destroy

  before_create :generate_order_number

  private

  def generate_order_number
    self.order_number ||= "ORD-#{Time.current.to_i}-#{SecureRandom.hex(3)}"
  end
end
