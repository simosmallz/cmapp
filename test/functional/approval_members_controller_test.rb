require 'test_helper'

class ApprovalMembersControllerTest < ActionController::TestCase
  setup do
    @approval_member = approval_members(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:approval_members)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create approval_member" do
    assert_difference('ApprovalMember.count') do
      post :create, approval_member: { name: @approval_member.name, position: @approval_member.position }
    end

    assert_redirected_to approval_member_path(assigns(:approval_member))
  end

  test "should show approval_member" do
    get :show, id: @approval_member
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @approval_member
    assert_response :success
  end

  test "should update approval_member" do
    put :update, id: @approval_member, approval_member: { name: @approval_member.name, position: @approval_member.position }
    assert_redirected_to approval_member_path(assigns(:approval_member))
  end

  test "should destroy approval_member" do
    assert_difference('ApprovalMember.count', -1) do
      delete :destroy, id: @approval_member
    end

    assert_redirected_to approval_members_path
  end
end
