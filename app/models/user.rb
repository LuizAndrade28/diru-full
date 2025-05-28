class User < ApplicationRecord
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable

  belongs_to :family, optional: true
  has_one :account, dependent: :destroy
  has_many  :transactions, dependent: :destroy
  has_many  :invites, class_name: "Invite",
                      foreign_key: :invited_by_id,
                      dependent: :destroy

  validates :first_name, :last_name, presence: true

  # 1) depois de criado, gera a conta padrão
  after_create :create_default_account

  def ensure_family!
    return if family.present?

    create_family_record!
  end

  def create_family_record!
    update!(family: Family.create!)
  end

  private

  # Callback 1: cria a conta do usuário
  def create_default_account
    create_account!
  end
end
