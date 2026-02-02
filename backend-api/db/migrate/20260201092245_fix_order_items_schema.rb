class FixOrderItemsSchema < ActiveRecord::Migration[8.0]
  def change
    # FKs (only add if missing)
    add_reference :order_items, :order, null: false, foreign_key: true unless column_exists?(:order_items, :order_id)
    add_reference :order_items, :product, null: false, foreign_key: true unless column_exists?(:order_items, :product_id)
    add_reference :order_items, :product_variant, foreign_key: true unless column_exists?(:order_items, :product_variant_id)

    # Fields used by model
    add_column :order_items, :price, :decimal, null: false, precision: 12, scale: 2, default: 0 unless column_exists?(:order_items, :price)
    add_column :order_items, :quantity, :integer, null: false, default: 1 unless column_exists?(:order_items, :quantity)
    add_column :order_items, :total, :decimal, null: false, precision: 12, scale: 2, default: 0 unless column_exists?(:order_items, :total)
    add_column :order_items, :product_name, :string unless column_exists?(:order_items, :product_name)

    # Helpful index (optional but good)
    add_index :order_items, [:order_id, :product_id] unless index_exists?(:order_items, [:order_id, :product_id])
  end
end
