class AddUserAndStatusToOrders < ActiveRecord::Migration[8.0]
  def change
    add_reference :orders, :user, null: false, foreign_key: true unless column_exists?(:orders, :user_id)
    add_column :orders, :status, :integer, null: false, default: 0 unless column_exists?(:orders, :status)
  end
end
