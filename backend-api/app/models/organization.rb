class Organization < ApplicationRecord
  has_many :users, foreign_key: :org_id, dependent: :destroy
  has_many :categories, foreign_key: :org_id, dependent: :destroy  
  has_many :products, foreign_key: :org_id, dependent: :destroy
end
