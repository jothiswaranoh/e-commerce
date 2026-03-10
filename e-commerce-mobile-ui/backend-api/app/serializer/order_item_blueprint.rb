class OrderItemBlueprint < Blueprinter::Base
  identifier :id

  fields :product_id, :product_name, :price, :quantity, :total
  
  association :product, blueprint: ProductBlueprint
end
