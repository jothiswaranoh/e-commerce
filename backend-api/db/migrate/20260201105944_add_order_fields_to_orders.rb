class AddOrderFieldsToOrders < ActiveRecord::Migration[8.0]
  def change
    add_reference :orders, :org, null: false, foreign_key: { to_table: :organizations } unless column_exists?(:orders, :org_id)

    add_column :orders, :order_number, :string, null: false unless column_exists?(:orders, :order_number)
    add_column :orders, :payment_status, :string, default: "unpaid", null: false unless column_exists?(:orders, :payment_status)

    add_column :orders, :subtotal, :decimal, precision: 10, scale: 2, default: 0 unless column_exists?(:orders, :subtotal)
    add_column :orders, :tax, :decimal, precision: 10, scale: 2, default: 0 unless column_exists?(:orders, :tax)
    add_column :orders, :shipping_fee, :decimal, precision: 10, scale: 2, default: 0 unless column_exists?(:orders, :shipping_fee)
    add_column :orders, :total, :decimal, precision: 10, scale: 2, default: 0 unless column_exists?(:orders, :total)

    add_index :orders, :order_number, unique: true unless index_exists?(:orders, :order_number)
  end
end
