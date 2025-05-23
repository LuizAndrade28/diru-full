class AddBankToTransactions < ActiveRecord::Migration[8.0]
  def change
    add_column :transactions, :bank_name, :integer
    add_index :transactions, :bank_name
  end
end
