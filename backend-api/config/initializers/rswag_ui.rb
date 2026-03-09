# frozen_string_literal: true

# Configure Swagger UI only if rswag is available
if defined?(Rswag::Ui)
  Rswag::Ui.configure do |c|
    # Path to your OpenAPI/Swagger document
    c.swagger_endpoint '/api-docs/v1/swagger.yaml', 'API V1 Docs'

    # Uncomment if your API requires basic auth
    # c.basic_auth_enabled = true
    # c.basic_auth_credentials 'username', 'password'
  end
end