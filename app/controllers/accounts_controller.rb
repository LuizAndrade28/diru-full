class AccountsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_account, only: %i[show edit update destroy]

  respond_to :html, :json

  # GET /accounts
  def index
    @accounts = current_user.family.users
                            .includes(:accounts)
                            .flat_map(&:accounts)
    respond_with(@accounts)
  end

  # GET /accounts/:id
  def show
    respond_with(@account)
  end

  # GET /accounts/new
  def new
    @account = current_user.accounts.build
  end

  # POST /accounts
  def create
    @account = current_user.accounts.build(account_params)
    flash[:notice] = "Conta criada." if @account.save
    respond_with(@account, location: accounts_path)
  end

  # GET /accounts/:id/edit
  def edit; end

  # PATCH/PUT /accounts/:id
  def update
    flash[:notice] = "Conta atualizada." if @account.update(account_params)
    respond_with(@account, location: account_path(@account))
  end

  # DELETE /accounts/:id
  def destroy
    @account.destroy
    flash[:notice] = "Conta removida."
    respond_with(@account, location: accounts_path)
  end

  private

  def set_account
    @account = current_user.family.accounts.find(params[:id])
  end

  def account_params
    params.require(:account).permit(:name, :opening_balance)
  end
end
