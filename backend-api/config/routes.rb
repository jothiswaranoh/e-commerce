Rails.application.routes.draw do
  # Swagger UI
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"

  namespace :api do
    namespace :v1 do
      # Auth
      post   "signup", to: "registrations#create"
      post   "login",  to: "sessions#create"
      delete "logout", to: "sessions#destroy"
      get    "me",     to: "users#show"

      resource :session, only: [:create, :destroy]
      resources :passwords, param: :token

      # Cart (one per user)
      resource :cart, only: [:show] do
        collection do
          post 'add', to: 'carts#add_item'
          get '', to: 'carts#show'
          put 'update', to: 'carts#update_item'
          delete 'remove', to: 'carts#remove_item'
        end

        # Legacy/Standard routes support
        post   :add_item
        patch  "items/:id", action: :update_item
        delete "items/:id", action: :remove_item
      end

      # Orders
      resources :orders, only: [:index, :show, :create]

      # Catalog
      resources :categories
      resources :products
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
