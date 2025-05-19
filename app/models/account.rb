class Account < ApplicationRecord
  belongs_to :user
  has_many   :transactions, dependent: :destroy
  has_many   :bills,        dependent: :destroy

  validates :opening_balance, presence: true

  # Current balance calculated in the query:
  def current_balance
    opening_balance + transactions.sum(:amount)
  end
end
