class BillsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_bill, only: %i[edit update destroy generate_transaction]

  respond_to :html, :json

  def new
    @bill = Bill.new
  end

  def create
    @bill = current_user
              .accounts
              .find(bill_params[:account_id])
              .bills
              .build(bill_params)

    flash[:notice] = "Fatura criada." if @bill.save
    respond_with(@bill, location: bills_path)
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
    @bill = current_user.family.accounts.flat_map(&:bills).find(params[:id])
  end

  def bill_params
    params.require(:bill)
          .permit(:amount, :description, :frequency, :next_due_date, :account_id)
  end
end
