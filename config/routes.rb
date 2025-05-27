Rails.application.routes.draw do
  root "home#index"

  get "up" => "rails/health#show", as: :rails_health_check
  get "/.well-known/appspecific/*path", to: proc { [ 204, {}, [] ] }

  devise_for :users

  # ----  API v1  ---- #
  scope path: "api/v1" do
    get  "/me",        to: "users#me"
    get  "/account",   to: "users#account"
    get  "meta/enums", to: "meta#enums"

    resources :transactions do
      collection do
        get :higher_category
        get :users_expenses
      end
    end

    resources :bills do
      post :generate_transaction, on: :member
    end

    resources :invites, only: [:create] do
      collection { get :pending }
      member do
        post :accept
        post :decline
      end
    end
  end
end
