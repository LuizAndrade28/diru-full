# Limpa o banco de dados e remove os dados de teste
Transaction.destroy_all
Account.destroy_all
User.destroy_all
Family.destroy_all

# # 1) Família e Usuários
user1  = User.create!(email: "luiz@example.com", first_name: "Luiz", last_name: "Andrade", password: "12345678")
user2  = User.create!(email: "cecilia@example.com", first_name: "Cecilia", last_name: "Andrade", password: "12345678")
user3  = User.create!(email: "test@example.com", first_name: "test", last_name: "Andrade", password: "12345678")

# 2) Transações
today = Date.current
user1.transactions.create!(
  kind:           :income,
  amount:         3000.00,
  happened_at:    today - 5,
  notes:          "Salário mensal",
  bank_name:      :nubank,
  account:        user1.account,
  category:       :salary
)

expenses = [
  {
    kind: :expense,
    amount: 100.00,
    happened_at: today - rand(1..10),
    notes: "Almoço com amigos",
    bank_name: :itau,
    account: user1.account,
    category: :food,
    owner: "Cecilia"
  },
  {
    kind: :expense,
    amount: 50.00,
    happened_at: today - rand(1..10),
    notes: "Cinema",
    bank_name: :nubank,
    account: user1.account,
    category: :leisure,
    owner: "Cecilia"
  },
  {
    kind: :expense,
    amount: 120.00,
    happened_at: today - rand(1..10),
    notes: "Supermercado",
    bank_name: :itau,
    account: user1.account,
    category: :food,
    owner: user1.first_name
  },
  {
    kind: :expense,
    amount: 80.00,
    happened_at: today - rand(1..10),
    notes: "Uber para o trabalho",
    bank_name: :nubank,
    account: user1.account,
    category: :transport,
    owner: "Cecilia"
  },
  {
    kind: :expense,
    amount: 30.00,
    happened_at: today - rand(1..10),
    notes: "Assinatura de revista",
    bank_name: :itau,
    account: user1.account,
    category: :other,
    owner: user1.first_name
  },
  {
    kind: :expense,
    amount: 200.00,
    happened_at: today - rand(1..10),
    notes: "Consulta médica",
    bank_name: :nubank,
    account: user1.account,
    category: :health,
    owner: user1.first_name
  }
]

expenses.each do |expense|
  user1.transactions.create!(expense)
end

# # 3) Fatura recorrente
# bill = user2.accounts.first.bills.create!(
#   amount:       150.00,
#   description:  "Plano de Streaming",
#   frequency:    :monthly,
#   next_due_date: today + 2.days
# )
# # Gera a primeira transação da fatura
# bill.generate_transaction!
