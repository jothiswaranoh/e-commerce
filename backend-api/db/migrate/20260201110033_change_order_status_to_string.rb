class ChangeOrderStatusToString < ActiveRecord::Migration[8.0]
  def change
    change_column :orders, :status, :string
  end
end
