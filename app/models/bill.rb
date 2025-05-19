class Bill < ApplicationRecord
  enum :frequency, { single: 0, weekly: 1, monthly: 2, yearly: 3 }

  belongs_to :account
  validates :amount, :frequency, :next_due_date, presence: true

  def generate_transaction!
    account.transactions.create!(
      kind:        :expense,
      amount:      amount,
      happened_at: next_due_date,
      notes:       "Fatura: #{description}",
      bank_name:   "",      # opcional: ou herdar de algum lugar
      bill:        self,
      user:        account.user,
    )
    advance_next_due_date
  end

  private

  def advance_next_due_date
    self.next_due_date =
      case frequency
      when "weekly"  then next_due_date + 7
      when "monthly" then next_due_date >> 1
      when "yearly"  then next_due_date >> 12
      end
    save!
  end
end
