require 'test_helper'

class ManagerControllerTest < ActionController::TestCase
  test "should get task" do
    get :task
    assert_response :success
  end

  test "should get plan" do
    get :plan
    assert_response :success
  end

end
