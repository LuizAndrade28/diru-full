class HomeController < ApplicationController
  # se você quisesse uma landing pública, faria:
  # skip_before_action :authenticate_user!, only: :index
  
  def index
  end
end
