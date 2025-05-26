class RemoveNameAndOpeningBalanceFromAccounts < ActiveRecord::Migration[8.0]
  def change
    remove_column :accounts, :name, :string
    remove_column :accounts, :opening_balance, :decimal
  end
end
