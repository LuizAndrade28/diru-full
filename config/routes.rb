Rails.application.routes.draw do
  get "home/index"
  devise_for :users
  get "up" => "rails/health#show", as: :rails_health_check
  get "/.well-known/appspecific/*path", to: proc { [204, {}, []] }
  root "home#index"

  resources :accounts
  resources :categories
  resources :transactions
  resources :bills do
    post :generate_transaction, on: :member
  end

end
