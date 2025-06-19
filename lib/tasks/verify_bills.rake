namespace :bills do
  desc "Verifica e gera transações para todas as bills"
  task verify_and_generate_transactions: :environment do
    puts "Iniciando verificação de bills..."
    Bill.find_each do |bill|
      bill.check_and_generate_transaction!
    end
    puts "Verificação concluída."
  end
end
