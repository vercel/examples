require "test_helper"

class TodoFlowTest < ActionDispatch::IntegrationTest
  test "create, persist, filter, complete, edit, reopen, and delete a task" do
    get root_path
    assert_response :success
    assert_select "h1", text: "Your tasks"
    assert_equal "private, no-store", response.headers["Cache-Control"]
    assert_difference "Todo.count", 1 do
      post todos_path, params: { todo: { title: "  Read a book  " } }
    end
    assert_response :see_other
    follow_redirect!
    assert_select ".task-title", "Read a book"
    todo = Todo.order(:id).last
    patch todo_path(todo), params: { todo: { completed: true } }
    assert todo.reload.completed?
    get root_path(filter: "active")
    assert_select ".task-title", count: 0
    get root_path(filter: "completed")
    assert_select ".task-title", "Read a book"
    get edit_todo_path(todo)
    assert_response :success
    patch todo_path(todo), params: { todo: { title: "Read two books", completed: false } }
    follow_redirect!
    assert_select ".task-title", "Read two books"
    assert_not todo.reload.completed?
    assert_difference "Todo.count", -1 do
      delete todo_path(todo)
    end
    follow_redirect!
    assert_select ".task-title", count: 0
  end

  test "blank tasks and invalid edits are rejected" do
    assert_no_difference "Todo.count" do
      post todos_path, params: { todo: { title: "   " } }
    end
    assert_response :unprocessable_entity
    assert_select "[role=alert]", text: /can't be blank/
    post todos_path, params: { todo: { title: "Keep this" } }
    todo = Todo.order(:id).last
    patch todo_path(todo), params: { todo: { title: "" } }
    assert_response :unprocessable_entity
    assert_equal "Keep this", todo.reload.title
  end

  test "another browser cannot read, edit, or delete this list" do
    post todos_path, params: { todo: { title: "Only for this browser" } }
    todo = Todo.order(:id).last
    visitor = open_session
    visitor.get root_path
    visitor.assert_select ".task-title", count: 0
    visitor.get edit_todo_path(todo)
    visitor.assert_response :not_found
    visitor.patch todo_path(todo), params: { todo: { title: "Changed" } }
    visitor.assert_response :not_found
    visitor.delete todo_path(todo)
    visitor.assert_response :not_found
    assert_equal "Only for this browser", todo.reload.title
  end

  test "client cannot choose a list id or inject HTML" do
    post todos_path, params: { todo: { title: "<script>alert(1)</script>", list_id: SecureRandom.uuid } }
    follow_redirect!
    assert_select ".task-title", "<script>alert(1)</script>"
    assert_select ".task-title script", count: 0
    assert_equal session[:list_id], Todo.order(:id).last.list_id
  end
end
