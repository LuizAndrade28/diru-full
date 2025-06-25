class AddInstallmentNumberToTransactions < ActiveRecord::Migration[8.0]
  def change
    add_column :transactions, :installment_number, :integer
  end
end
