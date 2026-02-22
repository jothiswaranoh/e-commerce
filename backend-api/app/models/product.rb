class Product < ApplicationRecord
  include Rails.application.routes.url_helpers
  belongs_to :organization,class_name:"Organization",foreign_key: :org_id
  belongs_to :category

  has_many :variants, class_name: 'ProductVariant', dependent: :destroy
  has_many :product_attributes, class_name: 'ProductAttribute', dependent: :destroy
  has_many :cart_items, dependent: :destroy
  has_many :order_items, dependent: :destroy
  has_many_attached :images

  accepts_nested_attributes_for :variants, allow_destroy: true,reject_if: :all_blank
  accepts_nested_attributes_for :product_attributes, allow_destroy: true,reject_if: :all_blank

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: { scope: :org_id, message: "should be unique within the organization" }
  validates :org_id, presence: true
  validates :category_id, presence: true
  validates :status, inclusion: { in: %w[active inactive archived], message: "%{value} is not a valid status" }

  attr_accessor :remove_image
  before_save :purge_images_if_requested

  validate :must_have_at_least_one_variant

  private

  def purge_images_if_requested
    if ActiveModel::Type::Boolean.new.cast(remove_image)
      images.purge if images.attached?
    end
  end

  def must_have_at_least_one_variant
    remaining = variants.reject(&:marked_for_destruction?)
    if remaining.empty?
      errors.add(:base, "Product must have at least one variant")
    end
  end

end
