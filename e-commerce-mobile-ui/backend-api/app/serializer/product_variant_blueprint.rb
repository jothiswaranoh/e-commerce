class ProductVariantBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :sku, :price, :stock
end