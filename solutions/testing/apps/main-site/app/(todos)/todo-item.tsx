import clsx from 'clsx'
import { Button } from '@vercel/examples-ui'
import { type Todo, updateTodo, removeTodo } from '#/actions/todos'
import { useTodos } from './todos-context'

export function TodoItem({ todo }: { todo: Todo }) {
  const { todos, optimisticUpdate } = useTodos()

  return (
    <li key={todo.id} className="flex items-center justify-content py-6 px-6">
      <span className="flex-1">
        <p className={clsx('font-medium', todo.done && 'line-through')}>
          {todo.title}
        </p>
      </span>
      <span className="w-48 flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="mr-2"
          onClick={async () => {
            optimisticUpdate(
              todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t))
            )
            await updateTodo(todo.id, { done: !todo.done })
          }}
        >
          {todo.done ? 'Undo' : 'Complete'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={async () => {
            optimisticUpdate(todos.filter((t) => t.id !== todo.id))
            await removeTodo(todo.id)
          }}
        >
          Remove
        </Button>
      </span>
    </li>
  )
}
