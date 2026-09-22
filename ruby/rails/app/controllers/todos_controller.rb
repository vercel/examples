class TodosController < ApplicationController
  before_action :set_filter
  before_action :set_todo, only: %i[edit update destroy]

  def index
    @todo = Todo.new
    load_list
  end

  def create
    @todo = current_list.new(params.expect(todo: [:title]))
    if @todo.save
      redirect_to root_path, notice: "Task added.", status: :see_other
    else
      load_list
      render :index, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @todo.update(params.expect(todo: [:title, :completed]))
      redirect_to root_path(filter: @filter), notice: "Task updated.", status: :see_other
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @todo.destroy!
    redirect_to root_path(filter: @filter), notice: "Task deleted.", status: :see_other
  end

  private

  def current_list
    session[:list_id] ||= SecureRandom.uuid
    Todo.where(list_id: session[:list_id])
  end

  def set_filter
    @filter = params[:filter].in?(%w[active completed]) ? params[:filter] : "all"
  end

  def set_todo
    @todo = current_list.find(params[:id])
  end

  def load_list
    counts = current_list.group(:completed).count
    @active_count = counts.fetch(false, 0)
    @completed_count = counts.fetch(true, 0)
    @total_count = @active_count + @completed_count
    @progress = @total_count.zero? ? 0 : (@completed_count.fdiv(@total_count) * 100).round
    @todos = current_list.in_list_order
    @todos = @todos.where(completed: @filter == "completed") unless @filter == "all"
  end
end
