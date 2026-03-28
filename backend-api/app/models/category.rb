class Category < ApplicationRecord
  belongs_to :organization, foreign_key: :org_id

  belongs_to :parent, class_name: "Category", optional: true
  has_many :children, class_name: "Category", foreign_key: :parent_id, dependent: :destroy
  has_one_attached :image
  has_many :products, dependent: :destroy

  attr_accessor :remove_image
  before_save :purge_image_if_requested
  
  validates :name, presence: true

  private

  def purge_image_if_requested
    if ActiveModel::Type::Boolean.new.cast(remove_image)
      image.purge if image.attached?
    end
  end

end