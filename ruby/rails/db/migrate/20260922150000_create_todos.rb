class CreateTodos < ActiveRecord::Migration[8.1]
  def change
    create_table :todos do |t|
      t.uuid :list_id, null: false
      t.string :title, limit: 200, null: false
      t.boolean :completed, null: false, default: false
      t.timestamps
    end
    add_index :todos, [:list_id, :completed, :created_at]
    add_check_constraint :todos, "char_length(trim(title)) > 0", name: "todos_title_not_blank"
  end
end
