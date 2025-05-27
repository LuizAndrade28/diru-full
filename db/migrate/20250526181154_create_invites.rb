class CreateInvites < ActiveRecord::Migration[8.0]
  def change
    create_table :invites do |t|
      t.string  :email,    null: false
      t.string  :token,    null: false
      t.integer :status,   null: false, default: 0      # 0=pending,1=accepted,2=declined
      t.references :invited_by, null: false,
                    foreign_key: { to_table: :users }

      t.timestamps
    end
    add_index :invites, :token, unique: true
  end
end
