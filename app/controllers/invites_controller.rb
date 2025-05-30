class InvitesController < ApplicationController
  before_action :authenticate_user!

  # POST /invites
  def create
    invite = current_user.invites.new(invite_params)

    user = User.find_by(email: invite.email)
    return render json: { errors: invite.errors.full_messages }, status: :unprocessable_entity if invite.check_if_invited_by(invite.email) || (user && (user.family == current_user.family || user.family != nil))

    if invite.save
      current_user.ensure_family!
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
                .or(Invite.pending.where(invited_by: current_user))
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

    invited_by = User.find(invite.invited_by.id)
    family = Family.find(invited_by.family.id)

    if family.users.length <= 1
      family.destroy!
      invited_by.family = nil
      invited_by.save!
    end

    head :no_content
  end

  def destroy
    invite = Invite.find(params[:id])
    if invite.destroy
      head :no_content
    else
      render json: { errors: invite.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def invite_params
    params.require(:invite).permit(:email)
  end
end
