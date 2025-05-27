class RemoveNameFromFamilies < ActiveRecord::Migration[8.0]
  def change
    remove_index :families, :name
    remove_column :families, :name
  end
end
