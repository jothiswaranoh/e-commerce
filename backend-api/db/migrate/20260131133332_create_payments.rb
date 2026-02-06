class CreatePayments < ActiveRecord::Migration[8.0]
  def change
    create_table :payments do |t|
      t.bigint :order_id, null: false

      t.string :provider                # stripe / razorpay / paypal
      t.string :payment_reference      # gateway transaction id

      t.decimal :amount, precision: 12, scale: 2, null: false
      t.string :currency, default: "INR"

      t.string :status, default: "pending"   # pending, paid, failed

      t.jsonb :gateway_response        # raw response

      t.timestamps
    end

    add_index :payments, :order_id
    add_index :payments, :payment_reference, unique: true

    add_foreign_key :payments, :orders
  end
end
