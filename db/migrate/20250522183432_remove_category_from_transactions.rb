class RemoveCategoryFromTransactions < ActiveRecord::Migration[8.0]
  def change
    remove_reference :transactions, :category, foreign_key: true
  end
end
