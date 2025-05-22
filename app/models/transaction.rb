class Transaction < ApplicationRecord
  enum :kind, { expense: 0, income: 1, reversal: 2 }
  enum :category, {
    other: 0, transport: 1, leisure: 2, salary: 3, food: 4, health: 5, education: 6, housing: 7, investments: 8, shopping: 9, travel: 10, pets: 11, gifts: 12, taxes: 13, insurance: 14, telephony: 15, internet: 16, energy: 17, water: 18, donations: 19, groceries: 20, subscriptions: 21, entertainment: 22, beauty: 24, hobbies: 26, home_improvement: 27, car_expenses: 28, electronics: 30
  }

  belongs_to :account
  belongs_to :user
  belongs_to :original, class_name: "Transaction", optional: true
  belongs_to :bill, optional: true

  validates :kind, :amount, :happened_at, presence: true
end
