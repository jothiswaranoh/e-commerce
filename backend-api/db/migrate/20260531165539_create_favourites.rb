class CreateFavourites < ActiveRecord::Migration[8.0]
  def change
    create_table :favourites do |t|
      t.references :org, null: false, foreign_key: { to_table: :organizations }
      t.references :user, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true

      t.timestamps
    end

    add_index :favourites, [:user_id, :product_id], unique: true
  end
end
