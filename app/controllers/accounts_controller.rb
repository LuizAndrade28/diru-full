class AccountsController < ApplicationController
  before_action :authenticate_user!

  respond_to :html, :json

  def index
    @accounts = current_user.accounts.includes(:transactions)
    respond_with(@accounts)
  end
end
