require "test_helper"

class MetaControllerTest < ActionDispatch::IntegrationTest
  test "should get enums" do
    get meta_enums_url
    assert_response :success
  end
end
