Rails.application.routes.draw do
  # Swagger UI
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'

  namespace :api do
    namespace :v1 do
      resource :session, only: [:create, :destroy]
      resources :passwords, param: :token


      post   "signup", to: "registrations#create"
      post   "login",  to: "sessions#create"
      delete "logout", to: "sessions#destroy"
      get    "me",     to: "users#show"
      resources :categories
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
