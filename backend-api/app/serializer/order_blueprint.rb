class OrderBlueprint < Blueprinter::Base
  identifier :id

  fields :order_number, :status, :payment_status, :subtotal, :tax, :shipping_fee, :total, :created_at
  field :shipping_address do |order|
    begin
      JSON.parse(order.shipping_address || "{}")
    rescue JSON::ParserError
      {}
    end
  end

  association :user, blueprint: UserBlueprint
  association :order_items, blueprint: OrderItemBlueprint
end
