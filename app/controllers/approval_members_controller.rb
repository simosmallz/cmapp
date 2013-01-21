class ApprovalMembersController < ApplicationController
  # GET /approval_members
  # GET /approval_members.json
  def index
    @approval_members = ApprovalMember.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @approval_members }
    end
  end

  # GET /approval_members/1
  # GET /approval_members/1.json
  def show
    @approval_member = ApprovalMember.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @approval_member }
    end
  end

  # GET /approval_members/new
  # GET /approval_members/new.json
  def new
    @approval_member = ApprovalMember.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @approval_member }
    end
  end

  # GET /approval_members/1/edit
  def edit
    @approval_member = ApprovalMember.find(params[:id])
  end

  # POST /approval_members
  # POST /approval_members.json
  def create
    @approval_member = ApprovalMember.new(params[:approval_member])

    respond_to do |format|
      if @approval_member.save
        format.html { redirect_to @approval_member, notice: 'Approval member was successfully created.' }
        format.json { render json: @approval_member, status: :created, location: @approval_member }
      else
        format.html { render action: "new" }
        format.json { render json: @approval_member.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /approval_members/1
  # PUT /approval_members/1.json
  def update
    @approval_member = ApprovalMember.find(params[:id])

    respond_to do |format|
      if @approval_member.update_attributes(params[:approval_member])
        format.html { redirect_to @approval_member, notice: 'Approval member was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @approval_member.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /approval_members/1
  # DELETE /approval_members/1.json
  def destroy
    @approval_member = ApprovalMember.find(params[:id])
    @approval_member.destroy

    respond_to do |format|
      format.html { redirect_to approval_members_url }
      format.json { head :no_content }
    end
  end
end
