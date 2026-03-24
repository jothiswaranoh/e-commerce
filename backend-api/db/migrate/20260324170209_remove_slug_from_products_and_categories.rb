class RemoveSlugFromProductsAndCategories < ActiveRecord::Migration[7.0]
  def change
    # Remove index if it exists (safe)
    remove_index :products, :slug if index_exists?(:products, :slug)
    remove_index :categories, :slug if index_exists?(:categories, :slug)

    # Remove columns
    remove_column :products, :slug, :string
    remove_column :categories, :slug, :string
  end
end