# db/seeds.rb

puts "🌱 Seeding database..."

# 1. Create Default Organization
org = Organization.find_or_create_by!(slug: "lookz-men") do |o|
  o.name = "Lookz Men"
  o.is_active = true
end
puts "✅ Organization '#{org.name}' ready."

# 2. Create Categories
categories = [
  "MENS T-SHIRTS",
  "MENS JEANS",
  "MENS FORMALS",
  "MENS ACCESSORIES",
  "MENS FOOTWEAR",
  "HOODIES/SWEATSHIRTS",
  "ACCESSORIES",
  "MENS FASHION"
]
category_map = {}

categories.each do |cat_name|
  category = Category.find_or_create_by!(slug: cat_name.downcase.parameterize, organization: org) do |c|
    c.name = cat_name
    c.is_active = true
  end
  category_map[cat_name] = category
  puts "✅ Category '#{cat_name}' ready."
end

# 3. Create Products
products_data = [
  {
    name: "Classic Leather Jacket",
    description: "Premium leather jacket for a timeless look.",
    category: "MENS FASHION",
    price: 199.99,
    image_url: "https://images.unsplash.com/photo-1551028919-ac7d21422e91?auto=format&fit=crop&q=80&w=800",
    sku: "JKT-001"
  },
  {
    name: "Slim Fit Denim Jeans",
    description: "Comfortable and stylish denim jeans.",
    category: "MENS JEANS",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=800",
    sku: "JNS-002"
  },
  {
    name: "Running Shoes",
    description: "High-performance running shoes.",
    category: "MENS FOOTWEAR",
    price: 89.99,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    sku: "SHS-003"
  },
  {
    name: "Smart Watch Series 5",
    description: "Track your fitness and stay connected.",
    category: "ACCESSORIES",
    price: 299.99,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    sku: "WTC-004"
  },
  {
    name: "Minimalist Desk Lamp",
    description: "Modern LED desk lamp with adjustable brightness.",
    category: "ACCESSORIES",
    price: 35.00,
    image_url: "https://images.unsplash.com/photo-1507473888900-52e1ad142756?auto=format&fit=crop&q=80&w=800",
    sku: "LMP-005"
  },
  {
    name: "Cotton T-Shirt",
    description: "Breathable 100% cotton t-shirt in various colors.",
    category: "MENS T-SHIRTS",
    price: 15.99,
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    sku: "TSH-006"
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat for your daily workout.",
    category: "HOODIES/SWEATSHIRTS",
    price: 25.00,
    image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
    sku: "YGM-007"
  },
  {
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones.",
    category: "MENS ACCESSORIES",
    price: 150.00,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    sku: "HDP-008"
  }
]

products_data.each do |p_data|
  product = Product.find_or_initialize_by(name: p_data[:name], organization: org)
  product.category = category_map[p_data[:category]]
  product.description = p_data[:description]
  product.slug = p_data[:name].downcase.parameterize
  product.status = "active"
  product.image_url = p_data[:image_url]

  variant = product.variants.find_or_initialize_by(sku: p_data[:sku])
  variant.name = "#{p_data[:name]} - Default"
  variant.price = p_data[:price]
  variant.stock = rand(10..100)
  variant.is_active = true

  product.save!
  variant.save!

  puts "✅ Product '#{product.name}' ready."
end


# 4. Create Default Admin User
admin_email = "admin@jothis.com"
admin_user = User.find_or_initialize_by(email_address: admin_email)
admin_user.update!(
  password: "password123",
  password_confirmation: "password123",
  role: :admin,
  organization: org,
  name: "Admin",
  phone_number: "9876543210"
)
puts "✅ Admin user '#{admin_email}' ready."

# 5. Create a Customer User (Optional but good for testing)
customer_email = "customer@example.com"
customer_user = User.find_or_initialize_by(email_address: customer_email)
customer_user.update!(
  password: "password123",
  password_confirmation: "password123",
  role: :customer,
  organization: org,
  name: "Customer",
  phone_number: "9876543211"
)
puts "✅ Customer user '#{customer_email}' ready."

puts "✨ Seeding completed!"
