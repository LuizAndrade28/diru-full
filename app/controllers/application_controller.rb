class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session      # CSRF p/ HTML (Ajax usa o token)
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  # libera first_name/last_name nos formulários Devise
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit :sign_up,        keys: %i[first_name last_name]
    devise_parameter_sanitizer.permit :account_update, keys: %i[first_name last_name]
  end

  def after_sign_in_path_for(resource)
    root_path
  end

  private

  def not_found
    respond_to do |format|
      format.json { render json: { error: "Recurso não encontrado" }, status: :not_found }
      format.html { render file: Rails.public_path.join("404.html"), status: :not_found, layout: false }
    end
  end
end
