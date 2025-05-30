class FamiliesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_family, only: %i[destroy exit_family]

  def family_members
    if current_user.family
      @family_members = current_user.family.users
      render json: @family_members, status: :ok
    else
      render json: { error: "Você não pertence a nenhuma família." }, status: :not_found
    end
  end

  def destroy
    if @family.users.length <= 1
      @family.destroy
    else
      exit_family
    end
  end

  def exit_family
    current_user.family = nil
    if current_user.save
      flash[:notice] = "Você saiu da família com sucesso."
      redirect_to root_path
    else
      flash[:alert] = "Erro ao sair da família."
      redirect_back(fallback_location: root_path)
    end
  end

  private

  def set_family
    @family = Family.find(params[:id])
  end
end
