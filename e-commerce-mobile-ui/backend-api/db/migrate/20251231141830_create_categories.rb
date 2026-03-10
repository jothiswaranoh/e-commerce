class CreateCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :categories do |t|
      t.bigint :org_id, null: false
      t.string :name, null: false
      t.string :slug, null: false
      t.bigint :parent_id
      t.boolean :is_active, default: true
      t.integer :sort_order, default: 0

      t.timestamps
    end

    add_foreign_key :categories, :organizations, column: :org_id
    add_index :categories, :org_id
    add_index :categories, [:org_id, :slug], unique: true
    add_index :categories, :parent_id
  end
end
