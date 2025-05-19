class CategoriesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_category, only: %i[show edit update destroy]

  respond_to :html, :json

  def index
    @categories = Category.order(:name)
    respond_with(@categories)
  end

  def show
    respond_with(@category)
  end

  def new
    @category = Category.new
  end

  def create
    @category = Category.new(category_params)
    flash[:notice] = "Categoria criada." if @category.save
    respond_with(@category, location: categories_path)
  end

  def edit; end

  def update
    flash[:notice] = "Categoria atualizada." if @category.update(category_params)
    respond_with(@category, location: category_path(@category))
  end

  def destroy
    @category.destroy
    flash[:notice] = "Categoria removida."
    respond_with(@category, location: categories_path)
  end

  private

  def set_category
    @category = Category.find(params[:id])
  end

  def category_params
    params.require(:category).permit(:name)
  end
end
