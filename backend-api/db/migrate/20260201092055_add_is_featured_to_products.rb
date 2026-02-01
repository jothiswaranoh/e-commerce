class AddIsFeaturedToProducts < ActiveRecord::Migration[8.0]
  def change
    add_column :products, :is_featured, :boolean
  end
end
