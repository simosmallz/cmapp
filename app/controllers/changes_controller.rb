class ChangesController < ApplicationController
  #layout 'main'
  # GET /changes
  # GET /changes.json
  def index
    @changes = Change.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @changes }
    end
  end

  # GET /changes/1
  # GET /changes/1.json
  def show
    @change = Change.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @change }
    end
  end

  # GET /changes/new
  # GET /changes/new.json
  def new
    @change = Change.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @change }
    end
  end

  # GET /changes/1/edit
  def edit
    @change = Change.find(params[:id])
  end

  # POST /changes
  # POST /changes.json
  def create
    @change = Change.new(params[:change])

    respond_to do |format|
      if @change.save
        format.html { redirect_to @change, notice: 'Change was successfully created.' }
        format.json { render json: @change, status: :created, location: @change }
      else
        format.html { render action: "new" }
        format.json { render json: @change.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /changes/1
  # PUT /changes/1.json
  def update
    @change = Change.find(params[:id])
    @task = Task.new
    @plan = Plan.new

    #if params[:task]
      #@task.description = params[:task]
      #@task.change_id = @change.id
    #elsif params[:plan]
      #@plan.description = params[:plan]
      #@plan.change_id = @change.id
    #end

    unless params[:task].nil?  
      @task.description = params[:task]
      @task.change_id = @change.id
    end
    
    unless params[:plan].nil?  
      @plan.description = params[:plan]
      @plan.change_id = @change.id
    end

    respond_to do |format|
      if @change.update_attributes(params[:change])
        @task.save
        @plan.save
        format.html { redirect_to @change, notice: 'Change was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @change.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /changes/1
  # DELETE /changes/1.json
  def destroy
    @change = Change.find(params[:id])
    @change.destroy

    respond_to do |format|
      format.html { redirect_to changes_url }
      format.json { head :no_content }
    end
  end
end
