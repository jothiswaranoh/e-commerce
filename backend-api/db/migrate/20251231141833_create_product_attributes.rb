class CreateProductAttributes < ActiveRecord::Migration[8.0]
  def change
    create_table :product_attributes do |t|
      t.references :product, null: false, foreign_key: true
      t.string :key, null: false
      t.string :value, null: false

      t.timestamps
    end

    add_index :product_attributes, [:product_id, :key]
  end
end
