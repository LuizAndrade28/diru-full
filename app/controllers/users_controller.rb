class UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    render json: current_user
  end

  def account
    account = current_user.account
    if account
      render json: account
    else
      render json: { error: "Account not found" }, status: :not_found
    end
  end
end
