class TransactionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_transaction, only: %i[show edit update destroy]

  respond_to :html, :json

  # GET /transactions
  # filtros opcionais: ?kind=expense&start=2025-05-01&end=2025-05-31
  def index
    scope = current_user.transactions
    scope = scope.where(kind: params[:kind])               if params[:kind].present?
    scope = scope.where(happened_at: params[:start]..params[:end]) \
                    if params[:start].present? && params[:end].present?

    @transactions = scope.order(happened_at: :desc)
    respond_with(@transactions)
  end

  def higher_category
    category_totals = current_user.transactions.where(kind: :expense).group(:category).sum(:amount)
    highest_category, total = category_totals.max_by { |_, sum| sum }
    @transaction = { category: highest_category, total: total }
    respond_with(@transaction)
  end

  def show
    respond_with(@transaction)
  end

  def new
    @transaction = Transaction.new
  end

  def create
    @transaction = current_user.transactions.build(transaction_params)
    flash[:notice] = "Transação criada." if @transaction.save
    respond_with(@transaction, location: transactions_path)
  end

  def edit; end

  def update
    flash[:notice] = "Transação atualizada." if @transaction.update(transaction_params)
    respond_with(@transaction, location: transaction_path(@transaction))
  end

  def destroy
    @transaction.destroy
    flash[:notice] = "Transação removida."
    respond_with(@transaction, location: transactions_path)
  end

  private

  def set_transaction
    @transaction = current_user.transactions.find(params[:id])
  end

  def transaction_params
    params.require(:transaction).permit(
      :kind, :category, :amount, :happened_at, :notes,
      :installments_qty, :bank_name,
      :account_id, :original_id
    )
  end
end
