class Payment < ApplicationRecord
  belongs_to :order

  validates :amount, presence: true
end
