class BillsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_bill, only: %i[edit update destroy generate_transaction]

  respond_to :html, :json

  def new
    @bill = Bill.new
  end

  def create
    account = current_user.account.presence

    if account.nil?
      flash[:alert] = "Conta não encontrada ou não pertence ao usuário atual."
      respond_with(nil, location: bills_path, status: :unprocessable_entity)
      return
    end

    @bill = account.bills.build(bill_params)

    if @bill.save
      begin
        @bill.generate_transaction! # Gera a primeira transação automaticamente
        flash[:notice] = "Fatura criada e transação gerada com sucesso."
      rescue => e
        flash[:alert] = "Fatura criada, mas houve um erro ao gerar a transação: #{e.message}"
      end
      respond_with(@bill, location: bills_path)
    else
      flash[:alert] = "Erro ao criar fatura."
      respond_with(@bill, location: bills_path, status: :unprocessable_entity)
    end
  end

  def edit; end

  def update
    flash[:notice] = "Fatura atualizada." if @bill.update(bill_params)
    respond_with(@bill, location: bill_path(@bill))
  end

  def destroy
    @bill.destroy
    flash[:notice] = "Fatura removida."
    respond_with(@bill, location: bills_path)
  end

  # POST /bills/:id/generate_transaction
  def generate_transaction
    @bill.generate_transaction!
    flash[:notice] = "Transação gerada."
    respond_with(@bill, location: bill_path(@bill))
  rescue => e
    respond_with(@bill, status: :unprocessable_entity, json: { error: e.message })
  end

  private

  def set_bill
    @bill = current_user.account.flat_map(&:bills).find(params[:id])
  end

  def bill_params
    params.require(:bill)
          .permit(:amount, :description, :frequency, :next_due_date, :account_id)
  end
end
