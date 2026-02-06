class AddPriceToCartItems < ActiveRecord::Migration[8.0]
  def change
    add_column :cart_items, :price, :decimal, precision: 10, scale: 2 unless column_exists?(:cart_items, :price)
  end
end
