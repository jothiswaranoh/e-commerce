class AddNameToProductVariants < ActiveRecord::Migration[8.0]
  def change
    add_column :product_variants, :name, :string
  end
end
