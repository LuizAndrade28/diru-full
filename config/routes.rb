Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get "/.well-known/appspecific/*path", to: proc { [ 204, {}, [] ] }

  devise_for :users
  get "/me", to: "users#me"
  
  root "home#index"

  resources :accounts
  resources :categories
  resources :transactions
  resources :bills do
    post :generate_transaction, on: :member
  end
end
