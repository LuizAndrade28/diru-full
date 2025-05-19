class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable

  belongs_to :family
  has_many   :accounts,     dependent: :destroy
  has_many   :transactions, dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true

  # 1) antes de validar um novo usuário, garanta que exista family
  before_validation :build_family, on: :create

  # 2) depois de criado, gera a conta padrão
  after_create :create_default_account

  private

  # Callback 1: cria (ou encontra) a família e já seta family_id
  def build_family
    # find_or_create_by evita duplicar famílias com mesmo last_name
    self.family ||= Family.find_or_create_by!(name: last_name)
  end

  # Callback 2: cria a conta padrão
  def create_default_account
    accounts.create!(
      name:            "Conta Corrente",
      opening_balance: 0
    )
  end
end
