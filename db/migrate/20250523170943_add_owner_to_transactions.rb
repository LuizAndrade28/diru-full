class AddOwnerToTransactions < ActiveRecord::Migration[8.0]
  def change
    add_column :transactions, :owner, :string
  end
end
