class CreateTransactions < ActiveRecord::Migration[8.0]
  def change
    create_table :transactions do |t|
      t.integer :kind, null: false, default: 0
      t.string :bank_name
      t.decimal :amount, precision: 10, scale: 2, null: false
      t.date :happened_at,    null: false
      t.text :notes
      t.integer :installments_qty
      t.references :original, foreign_key: { to_table: :transactions }
      t.references :account, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.references :category, foreign_key: true
      t.references :bill, foreign_key: true

      t.timestamps
    end

    add_index :transactions, :kind
    add_index :transactions, :happened_at
  end
end
