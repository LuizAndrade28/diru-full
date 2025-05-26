class MetaController < ApplicationController
  before_action :authenticate_user!

  def enums
    render json: {
      bank_names:   Transaction.bank_names,   # {"nubank"=>0, "itau"=>1, …}
      categories:   Transaction.categories,   # {"other"=>0, …}
      kinds:        Transaction.kinds         # se precisar
    }
  end
end
