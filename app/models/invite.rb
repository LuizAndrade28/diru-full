class Invite < ApplicationRecord
  enum :status, { pending: 0, accepted: 1, declined: 2 }, prefix: true,
                                                      default: :pending

  belongs_to :invited_by, class_name: "User"

  validates :email,
            presence: true,
            format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :token, presence: true, uniqueness: true

  before_validation :generate_token, on: :create

  scope :pending, -> { where(status: :pending) }
  scope :for_user, ->(user) { pending.where(email: user.email) }

  # chama quando o destinatário clicar no link:
  def accept!(user)
    transaction do
      user.update!(family: invited_by.family) # entra na família
      update!(status: :accepted)
    end
  end

  def check_if_invited_by(email)
    email == invited_by.email
  rescue StandardError
    false
  end

  def decline!
    update!(status: :declined)
  end

  def self.find_by_token!(token) = pending.find_by!(token:)

  private

  def generate_token
    self.token ||= SecureRandom.hex(20)
  end
end
