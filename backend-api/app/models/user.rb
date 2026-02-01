class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_one :cart, dependent: :destroy

  enum :role, {
    admin: "admin",
    manager: "manager",
    user: "user",
    customer: "customer"
  }
  

  validates :role, inclusion: { in: roles.keys }

  belongs_to :organization, foreign_key: :org_id
  normalizes :email_address, with: ->(e) { e.strip.downcase }
end




