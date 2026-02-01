class AddOrderFieldsToOrders < ActiveRecord::Migration[8.0]
  def change
    add_reference :orders, :org, null: false, foreign_key: { to_table: :organizations }

    add_column :orders, :order_number, :string, null: false
    add_column :orders, :payment_status, :string, default: "unpaid", null: false

    add_column :orders, :subtotal, :decimal, precision: 10, scale: 2, default: 0
    add_column :orders, :tax, :decimal, precision: 10, scale: 2, default: 0
    add_column :orders, :shipping_fee, :decimal, precision: 10, scale: 2, default: 0
    add_column :orders, :total, :decimal, precision: 10, scale: 2, default: 0

    add_index :orders, :order_number, unique: true
  end
end
