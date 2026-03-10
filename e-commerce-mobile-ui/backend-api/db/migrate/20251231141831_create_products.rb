class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.bigint :org_id, null: false
      t.references :category, null: false, foreign_key: true
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.string :status, default: "active"

      t.timestamps
    end

    add_foreign_key :products, :organizations, column: :org_id
    add_index :products, :org_id
    add_index :products, [:org_id, :slug], unique: true
  end
end
