class AddInstallmentTotalToTransactions < ActiveRecord::Migration[8.0]
  def change
    add_column :transactions, :installment_total, :integer
  end
end
