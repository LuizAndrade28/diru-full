class InvitesController < ApplicationController
  before_action :authenticate_user!

  # POST /invites
  def create
    current_user.ensure_family!
    invite = current_user.invites.new(invite_params)

    if !invite.check_if_invited_by(invite.email) && invite.save
      render json: invite, status: :created
    else
      render json: { errors: invite.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /invites/pending
  def pending
    invites = Invite
                .pending
                .where(email: current_user.email)
                .includes(:invited_by)

    render json: invites.as_json(
      only:   %i[id email token created_at],
      include: { invited_by: { only: %i[id first_name email] } }
    )
  end

  # POST /invites/:id/accept
  def accept
    invite = Invite.pending.find(params[:id])
    invite.accept!(current_user)
    head :no_content
  end

  # POST /invites/:id/decline
  def decline
    invite = Invite.pending.find(params[:id])
    invite.decline!
    head :no_content
  end

  private

  def invite_params
    params.require(:invite).permit(:email)
  end
end
