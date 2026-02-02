class Order < ApplicationRecord
  belongs_to :organization, foreign_key: :org_id
  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :payments, dependent: :destroy

  STATUSES = %w[pending confirmed shipped delivered cancelled].freeze
  PAYMENT_STATUSES = %w[unpaid paid refunded].freeze

  validates :order_number, presence: true, uniqueness: true
  validates :status, inclusion: { in: STATUSES }
  validates :payment_status, inclusion: { in: PAYMENT_STATUSES }
  validates :total, numericality: { greater_than_or_equal_to: 0 }

  before_validation :set_defaults, on: :create
  before_validation :generate_order_number, on: :create
  before_save :recalculate_totals

  private

  def set_defaults
    self.status ||= "pending"
    self.payment_status ||= "unpaid"
  end

  def generate_order_number
    self.order_number ||= "ORD-#{Time.current.to_i}-#{SecureRandom.hex(3).upcase}"
  end

  def recalculate_totals
    self.subtotal = order_items.sum(:total)
    self.tax ||= 0
    self.shipping_fee ||= 0
    self.total = subtotal.to_f + tax.to_f + shipping_fee.to_f
  end
end
