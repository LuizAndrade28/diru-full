class TransactionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_transaction, only: %i[edit update destroy]
  before_action :set_scope, only: %i[index higher_category users_expenses]

  respond_to :html, :json

  def index
    # scope = scope.where(kind: params[:kind])               if params[:kind].present?
    @transactions = @scope.order(happened_at: :desc)
    respond_with(@transactions)
  end

  def higher_category
    category_totals = @scope.where(kind: :expense).group(:category).sum(:amount)

    highest_category, total = category_totals.max_by { |_, sum| sum }
    @transaction = { category: highest_category, total: total }

    render json: @transaction
  end

  def users_expenses
    users_expenses_raw = @scope.where(kind: :expense).group(:owner).sum(:amount)

    result = users_expenses_raw.map do |owner, total|
      user = User.find_by(first_name: owner)
      {
        owner: owner,
        total: total,
        user_id: user&.id
      }
    end

    render json: result
  end

  def new
    @transaction = Transaction.new
  end

  def create
    @transaction = current_user.transactions.build(transaction_params)

    if @transaction.owner.present?
      @transaction.owner = @transaction.owner.strip.capitalize
    else
      @transaction.owner = current_user.first_name
    end

    if @transaction.save
      flash[:notice] = "Transação criada."
      respond_with(@transaction, location: transactions_path)
    else
      flash[:alert] = "Erro ao criar transação."
      respond_with(@transaction, location: new_transaction_path)
    end
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

  def set_scope
    start_date = params[:start].presence || Date.current.beginning_of_month
    end_date = params[:end].presence || Date.current.end_of_month

    family_user_ids = current_user.family.users.where.not(id: current_user.id).pluck(:id) if current_user.family

    @scope = Transaction
              .where(user_id: (family_user_ids ? [ current_user.id ] + family_user_ids : current_user.id))
              .where(happened_at: start_date..end_date)
    @scope = @scope.where(happened_at: params[:start]..params[:end]) \
                    if params[:start].present? && params[:end].present?
  end

  def transaction_params
    params.require(:transaction).permit(
      :kind, :category, :amount, :happened_at, :notes,
      :installments_qty, :bank_name,
      :account_id, :original_id, :owner
    )
  end
end
