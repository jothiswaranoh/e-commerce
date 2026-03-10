class OrderBlueprint < Blueprinter::Base
  identifier :id

  fields :order_number, :status, :payment_status, :subtotal, :tax, :shipping_fee, :total, :created_at

  association :user, blueprint: UserBlueprint
  association :order_items, blueprint: OrderItemBlueprint
end
