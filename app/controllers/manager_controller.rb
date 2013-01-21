class ManagerController < ApplicationController

  def task
  	@change = Change.find params[:change_id]
  	@task = Task.new
  end

  def plan
  	@change = Change.find params[:change_id]
  	@plan = Plan.new
  end
end
