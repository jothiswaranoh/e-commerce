# Find the first user and organization to attach data to
user = User.first || User.create!(email_address: "demo@example.com", password: "password", password_confirmation: "password", role: "customer")
org = Organization.first || Organization.create!(name: "Demo Org", slug: "demo-org", is_active: true)

# Ensure user has org (fix association if needed)
user.update!(org: org) if user.org_id.nil?

puts "Seeding data for Organization: #{org.name}"

# Clear existing products to avoid duplicates and mixed states
puts "Cleaning up existing data..."
CartItem.destroy_all
OrderItem.destroy_all
ProductVariant.destroy_all
ProductAttribute.destroy_all
Product.destroy_all
Category.destroy_all

# Mock Data from frontend
mock_products = [
  {
    name: 'Premium Wireless Headphones',
    price: 2499,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics'
  },
  {
    name: 'Vintage Camera',
    price: 4999,
    image: 'https://images.pexels.com/photos/606933/pexels-photo-606933.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics'
  },
  {
    name: 'Designer Watch',
    price: 3499,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion'
  },
  {
    name: 'Leather Backpack',
    price: 1999,
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion'
  },
  {
    name: 'Modern Desk Lamp',
    price: 1299,
    image: 'https://images.pexels.com/photos/313659/pexels-photo-313659.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Home'
  },
  {
    name: 'Comfortable Chair',
    price: 5999,
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Home'
  },
  {
    name: 'Professional Yoga Mat',
    price: 1599,
    image: 'https://images.pexels.com/photos/4327049/pexels-photo-4327049.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports'
  },
  {
    name: 'Running Shoes',
    price: 3999,
    image: 'https://images.pexels.com/photos/3718897/pexels-photo-3718897.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports'
  },
  {
    name: 'Smartphone Stand',
    price: 599,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics'
  },
  {
    name: 'Cotton T-Shirt',
    price: 699,
    image: 'https://images.pexels.com/photos/2769274/pexels-photo-2769274.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fashion'
  },
  {
    name: 'Wooden Shelf',
    price: 2199,
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Home'
  },
  {
    name: 'Dumbbell Set',
    price: 2899,
    image: 'https://images.pexels.com/photos/3621812/pexels-photo-3621812.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports'
  }
]

puts "Creating Categories..."
categories = {}
['Electronics', 'Fashion', 'Home', 'Sports'].each do |cat_name|
  categories[cat_name] = Category.create!(
    name: cat_name,
    slug: cat_name.parameterize,
    organization: org,
    is_active: true
  )
end

puts "Creating Products..."
mock_products.each_with_index do |p_data, index|
  product = Product.create!(
    name: p_data[:name],
    slug: p_data[:name].parameterize + "-#{index}", # Ensure unique slug
    description: "Description for #{p_data[:name]}",
    status: 'active',
    organization: org,
    category: categories[p_data[:category]],
    image_url: p_data[:image]
  )

  # Create Product Variant
  ProductVariant.create!(
    product: product,
    sku: "SKU-#{product.slug.upcase}-001",
    price: p_data[:price],
    stock: 100,
    is_active: true
  )
end

puts "Seeding completed successfully!"
