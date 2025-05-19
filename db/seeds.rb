# Limpa o banco de dados e remove os dados de teste
Transaction.destroy_all
Account.destroy_all
User.destroy_all
Family.destroy_all
Category.destroy_all

# 1) Família e Usuários
user1  = User.create!(email: "luiz@example.com", first_name: "Luiz", last_name: "Andrade", password: "12345678")
user2  = User.create!(email: "cecilia@example.com", first_name: "Cecilia", last_name: "Andrade", password: "12345678")

# 2) Categorias
%w[Alimentação Transporte Lazer Salário Outros].each do |cat|
  Category.create!(name: cat)
end

# 3) Transações
today = Date.current
user1.transactions.create!(
  kind:           :income,
  amount:         3000.00,
  happened_at:    today - 5,
  notes:          "Salário mensal",
  bank_name:      "Empresa X",
  account:        user1.accounts.first,
  category:       Category.find_by(name: "Salário")
)

user1.transactions.create!(
  kind:            :expense,
  amount:          200.00,
  happened_at:     today - 3,
  notes:           "Gasolina carro",
  bank_name:       "Itau",
  installments_qty: 2,
  account:        user1.accounts.first,
  category:        Category.find_by(name: "Transporte")
)

# 3) Fatura recorrente
bill = user2.accounts.first.bills.create!(
  amount:       150.00,
  description:  "Plano de Streaming",
  frequency:    :monthly,
  next_due_date: today + 2.days
)
# Gera a primeira transação da fatura
bill.generate_transaction!
