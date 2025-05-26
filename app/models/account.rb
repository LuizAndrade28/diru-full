class Account < ApplicationRecord
  belongs_to :user
  has_many   :transactions, dependent: :destroy
  has_many   :bills,        dependent: :destroy

  # Current balance calculated in the query:
  def current_monthly_balance
    transactions.where(kind: :expense).sum(:amount)
  end

  def as_json(options = {})
    super(options).merge(current_monthly_balance: current_monthly_balance)
  end
end
