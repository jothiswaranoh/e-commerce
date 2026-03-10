class CreateCarts < ActiveRecord::Migration[8.0]
  def change
    create_table :carts do |t|
      t.bigint :org_id, null: false
      t.bigint :user_id, null: false

      t.timestamps
    end

    create_table :cart_items do |t|
      t.bigint :cart_id, null: false
      t.bigint :product_id, null: false
      t.bigint :product_variant_id

      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :quantity, default: 1
      t.decimal :total, precision: 12, scale: 2, default: 0

      t.timestamps
    end

    add_index :carts, :org_id
    add_index :carts, :user_id

    add_foreign_key :carts, :organizations, column: :org_id
    add_foreign_key :carts, :users

    add_foreign_key :cart_items, :carts
    add_foreign_key :cart_items, :products
    add_foreign_key :cart_items, :product_variants
  end
end
