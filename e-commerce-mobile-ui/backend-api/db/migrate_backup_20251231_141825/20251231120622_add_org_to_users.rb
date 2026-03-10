class AddOrgToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :org_id, :bigint, null: false
    add_foreign_key :users, :organizations, column: :org_id
    add_index :users, :org_id
  end
end
