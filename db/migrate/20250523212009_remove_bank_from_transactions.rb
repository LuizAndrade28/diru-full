class RemoveBankFromTransactions < ActiveRecord::Migration[8.0]
  def change
    remove_column :transactions, :bank_name, :string
  end
end
