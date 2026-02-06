class AddTotalToCartItems < ActiveRecord::Migration[8.0]
  def change
    add_column :cart_items, :total, :decimal, precision: 10, scale: 2, default: 0, null: false unless column_exists?(:cart_items, :total)
  end
end
