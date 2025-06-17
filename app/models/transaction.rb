class Transaction < ApplicationRecord
  enum :kind, {
    expense: 0, income: 1, reversal: 2
  }
  enum :bank_name, {
    nubank: 0, itau: 1, bradesco: 2, santander: 3, caixa: 4, banco_do_brasil: 5, inter: 6, original: 7, picpay: 8, mercado_pago: 9, pagseguro: 10, banrisul: 11, sicredi: 12, bmg: 13, next: 14, agibank: 15, bs2: 16
  }
  enum :category, {
    other: 0, transport: 1, leisure: 2, salary: 3, food: 4, health: 5, education: 6, housing: 7, investments: 8, shopping: 9, travel: 10, pets: 11, gifts: 12, taxes: 13, insurance: 14, telephony: 15, internet: 16, energy: 17, water: 18, donations: 19, groceries: 20, subscriptions: 21, entertainment: 22, beauty: 24, hobbies: 26, home_improvement: 27, car_expenses: 28, electronics: 30
  }

  before_validation :set_notes

  after_create :set_installments

  belongs_to :account
  belongs_to :user
  belongs_to :original, class_name: "Transaction", optional: true
  belongs_to :bill, optional: true

  validates :kind, :amount, :happened_at, presence: true
  validates :amount, numericality: { greater_than: 0 }
  validates :installments_qty, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true

  private
  def set_installments
    if self.installments_qty.blank? || self.installments_qty.to_i < 1
      self.installments_qty = nil
      self.save! if persisted?
      return
    end
    return unless self.original_id.nil?

    installment = (self.amount / self.installments_qty).round(2)

    self.installments_qty.times do |i|
      Transaction.create!(
        kind: self.kind,
        category: self.category,
        amount: installment,
        happened_at: self.happened_at + i.months,
        notes: self.notes,
        bank_name: self.bank_name,
        account_id: self.account_id,
        original_id: self.id,
        user_id: self.user_id,
        owner: self.owner,
        installment_number: i + 1,
        installment_total: self.installments_qty
      )
    end
  end

  def set_notes
    if self.notes.present?
      self.notes = self.notes.strip
    end
  end
end
