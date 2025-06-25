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

  before_validation :normalize_name
  after_create :create_default_account

  def ensure_family!
    return if family.present?

    create_family_record!
  end

  def create_family_record!
    update!(family: Family.create!)
  end

  private

  def create_default_account
    create_account!
  end

  def normalize_name
    self.first_name = first_name.strip.titleize if first_name.present?
    self.last_name = last_name.strip.titleize if last_name.present?
  end
end
