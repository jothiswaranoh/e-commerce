class Product < ApplicationRecord
  belongs_to :org
  belongs_to :category
end
