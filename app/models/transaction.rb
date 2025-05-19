class Transaction < ApplicationRecord
  enum :kind, { expense: 0, income: 1, reversal: 2 }

  belongs_to :account
  belongs_to :user
  belongs_to :category, optional: true
  belongs_to :original, class_name: "Transaction", optional: true
  belongs_to :bill, optional: true

  validates :kind, :amount, :happened_at, presence: true
end
