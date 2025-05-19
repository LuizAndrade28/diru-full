class CreateBills < ActiveRecord::Migration[8.0]
  def change
    create_table :bills do |t|
      t.decimal :amount,        precision: 10, scale: 2, null: false
      t.string :description
      t.integer :frequency,     null: false, default: 0
      t.date :next_due_date, null: false
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end

    add_index :bills, :frequency
    add_index :bills, :next_due_date
  end
end
