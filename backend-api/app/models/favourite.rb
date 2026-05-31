class Favourite < ApplicationRecord
  belongs_to :org, class_name: 'Organization'
  belongs_to :user
  belongs_to :product
end
