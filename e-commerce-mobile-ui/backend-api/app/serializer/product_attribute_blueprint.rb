class ProductAttributeBlueprint < Blueprinter::Base
  identifier :id

  fields :key, :value
end