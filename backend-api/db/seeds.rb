# db/seeds.rb

puts "🌱 Seeding database..."

# 1. Create Default Organization
org = Organization.find_or_create_by!(slug: "lookz-men") do |o|
  o.name = "Lookz Men"
  o.is_active = true
end
puts "✅ Organization '#{org.name}' ready."

# 2. Create Default Admin User
admin_email = "admin@jothis.com"
admin_user = User.find_or_initialize_by(email_address: admin_email)
admin_user.update!(
  password: "password123",
  password_confirmation: "password123",
  role: :admin,
  organization: org
)
puts "✅ Admin user '#{admin_email}' ready."

# 3. Create a Customer User (Optional but good for testing)
customer_email = "customer@example.com"
customer_user = User.find_or_initialize_by(email_address: customer_email)
customer_user.update!(
  password: "password123",
  password_confirmation: "password123",
  role: :customer,
  organization: org
)
puts "✅ Customer user '#{customer_email}' ready."

puts "✨ Seeding completed!"
