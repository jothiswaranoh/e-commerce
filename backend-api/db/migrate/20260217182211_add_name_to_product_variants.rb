class AddNameToProductVariants < ActiveRecord::Migration[8.0]
  def change
    unless column_exists?(:product_variants, :name)
      add_column :product_variants, :name, :string, null: false, default: ""
    else
      change_column_null :product_variants, :name, false, ""
    end
  end
end
