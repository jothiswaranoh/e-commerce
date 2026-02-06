class ProductVariantBlueprint < Blueprinter::Base
  identifier :id

  fields :sku, :price, :stock
end