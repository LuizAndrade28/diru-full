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
      bank_name:   "",
      bill:        self,
      user:        account.user,
    )
    advance_next_due_date(next_due_date)
  end

  def check_and_generate_transaction!
    # Encontra a última transação gerada para esta bill
    last_transaction = account.transactions.where(bill_id: id).order(happened_at: :desc).first

    # Define a data de referência para verificar se uma nova transação deve ser criada
    reference_date = last_transaction&.happened_at || next_due_date

    # Calcula a próxima data de transação com base na frequência
    next_transaction_date =
      case frequency
      when "weekly"  then reference_date + 7.days
      when "monthly" then reference_date.next_month
      when "yearly"  then reference_date.next_year
      else reference_date # Para frequência "single", não avança
      end

    # Verifica se já existe uma transação para a próxima ocorrência
    existing_transaction = account.transactions.find_by(
      bill_id: id,
      happened_at: next_transaction_date
    )

    # Se não existir transação para a próxima ocorrência, gera uma nova
    unless existing_transaction
      account.transactions.create!(
        kind:        :expense,
        amount:      amount,
        happened_at: next_transaction_date,
        notes:       "Fatura: #{description}",
        bank_name:   "",
        bill:        self,
        user:        account.user,
      )
      advance_next_due_date(next_transaction_date)
    end
  end

  private

  def advance_next_due_date(reference_date)
    self.next_due_date =
      case frequency
      when "weekly"  then reference_date + 7.days
      when "monthly" then reference_date.next_month
      when "yearly"  then reference_date.next_year
      else reference_date # Para frequência "single", não avança
      end
    save!
  end
end
