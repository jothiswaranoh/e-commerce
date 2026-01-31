# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_01_31_133332) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "cart_items", force: :cascade do |t|
    t.bigint "cart_id", null: false
    t.bigint "product_id", null: false
    t.bigint "product_variant_id"
    t.decimal "price", precision: 10, scale: 2, null: false
    t.integer "quantity", default: 1
    t.decimal "total", precision: 12, scale: 2, default: "0.0"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "carts", force: :cascade do |t|
    t.bigint "org_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["org_id"], name: "index_carts_on_org_id"
    t.index ["user_id"], name: "index_carts_on_user_id"
  end

  create_table "categories", force: :cascade do |t|
    t.bigint "org_id", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.bigint "parent_id"
    t.boolean "is_active", default: true
    t.integer "sort_order", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["org_id", "slug"], name: "index_categories_on_org_id_and_slug", unique: true
    t.index ["org_id"], name: "index_categories_on_org_id"
    t.index ["parent_id"], name: "index_categories_on_parent_id"
  end

  create_table "orders", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "organizations", force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.boolean "is_active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "payments", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.string "provider"
    t.string "payment_reference"
    t.decimal "amount", precision: 12, scale: 2, null: false
    t.string "currency", default: "INR"
    t.string "status", default: "pending"
    t.jsonb "gateway_response"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_payments_on_order_id"
    t.index ["payment_reference"], name: "index_payments_on_payment_reference", unique: true
  end

  create_table "product_attributes", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.string "key", null: false
    t.string "value", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id", "key"], name: "index_product_attributes_on_product_id_and_key"
    t.index ["product_id"], name: "index_product_attributes_on_product_id"
  end

  create_table "product_variants", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.string "sku", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.integer "stock", default: 0
    t.boolean "is_active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_product_variants_on_product_id"
    t.index ["sku"], name: "index_product_variants_on_sku", unique: true
  end

  create_table "products", force: :cascade do |t|
    t.bigint "org_id", null: false
    t.bigint "category_id", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.string "status", default: "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_products_on_category_id"
    t.index ["org_id", "slug"], name: "index_products_on_org_id_and_slug", unique: true
    t.index ["org_id"], name: "index_products_on_org_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "user_sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "access_token_hash"
    t.string "refresh_token_hash"
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "expires_at"
    t.datetime "revoked_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email_address", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "org_id", null: false
    t.string "role"
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
    t.index ["org_id"], name: "index_users_on_org_id"
  end

  add_foreign_key "cart_items", "carts"
  add_foreign_key "cart_items", "product_variants"
  add_foreign_key "cart_items", "products"
  add_foreign_key "carts", "organizations", column: "org_id"
  add_foreign_key "carts", "users"
  add_foreign_key "categories", "organizations", column: "org_id"
  add_foreign_key "payments", "orders"
  add_foreign_key "product_attributes", "products"
  add_foreign_key "product_variants", "products"
  add_foreign_key "products", "categories"
  add_foreign_key "products", "organizations", column: "org_id"
  add_foreign_key "sessions", "users"
  add_foreign_key "user_sessions", "users"
  add_foreign_key "users", "organizations", column: "org_id"
end
