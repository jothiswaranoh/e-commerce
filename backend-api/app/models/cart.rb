class Cart < ApplicationRecord
  belongs_to :organization, foreign_key: :org_id
  belongs_to :user
  has_many :cart_items, dependent: :destroy
end
