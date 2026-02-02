class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.bigint :org_id, null: false
      t.bigint :user_id, null: false

      t.string :order_number, null: false
      t.string :status, default: "pending"

      t.decimal :subtotal, precision: 12, scale: 2, default: 0
      t.decimal :tax, precision: 12, scale: 2, default: 0
      t.decimal :shipping_fee, precision: 12, scale: 2, default: 0
      t.decimal :total, precision: 12, scale: 2, default: 0

      t.string :payment_status, default: "unpaid"
      t.string :payment_method

      t.text :shipping_address
      t.text :billing_address

      t.timestamps
    end

    create_table :order_items do |t|
      t.bigint :order_id, null: false
      t.bigint :product_id, null: false
      t.bigint :product_variant_id

      t.string :product_name
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :quantity, default: 1
      t.decimal :total, precision: 12, scale: 2, default: 0

      t.timestamps
    end

        add_index :orders, :order_number, unique: true
        add_foreign_key :orders, :organizations, column: :org_id
        add_foreign_key :orders, :users, column: :user_id
        add_foreign_key :order_items, :orders, column: :order_id
        add_foreign_key :order_items, :products, column: :product_id
        add_foreign_key :order_items, :product_variants, column: :product_variant_id
  end
end