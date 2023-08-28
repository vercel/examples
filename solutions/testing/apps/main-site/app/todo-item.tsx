'use client'

import clsx from 'clsx'
import { Button } from '@vercel/examples-ui'
import { type Todo, updateTodo, removeTodo } from '#/actions/todos'

export function TodoItem({ todo }: { todo: Todo }) {
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
            await updateTodo(todo.id, { done: !todo.done })
            // await mutate({ todos }, { revalidate: false })
          }}
        >
          {todo.done ? 'Undo' : 'Complete'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={async () => {
            await removeTodo(todo.id)
            // await mutate({ todos }, { revalidate: false })
          }}
        >
          Remove
        </Button>
      </span>
    </li>
  )
}
