class Category < ApplicationRecord
  belongs_to :organization, foreign_key: :org_id, dependent: :destroy
end
