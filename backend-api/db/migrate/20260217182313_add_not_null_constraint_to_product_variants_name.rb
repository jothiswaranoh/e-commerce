class AddNotNullConstraintToProductVariantsName < ActiveRecord::Migration[8.0]
  def change
    change_column_null :product_variants, :name, false
  end
end