require "test_helper"

class TodoTest < ActiveSupport::TestCase
  test "normalizes titles and rejects blank or oversized tasks" do
    todo = Todo.new(list_id: SecureRandom.uuid, title: "  Take a walk  ")
    assert todo.valid?
    assert_equal "Take a walk", todo.title
    assert_not todo.completed?
    todo.title = "   "
    assert_not todo.valid?
    todo.title = "a" * 201
    assert_not todo.valid?
  end
end
