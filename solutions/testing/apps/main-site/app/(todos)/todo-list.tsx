'use client'

// import useSWR from 'swr'
import { Todo } from '#/actions/todos'
import { tid } from '#/lib/data-testid'
import { useSetTodos, useTodos } from './todos-context'
import { TodoItem } from './todo-item'
import { useEffect } from 'react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TodoList({ todos: data }: { todos: Todo[] }) {
  // const { data, error, mutate } = useSWR('/api/todo', fetcher)
  const setTodos = useSetTodos()
  const [todos] = useTodos()

  // Populate the client-side state of todos. This enables the form to read the todos from context.
  useEffect(() => {
    setTodos(data)
  }, [data, setTodos])

  if (!todos.length) return null

  return (
    <ul
      data-testid={tid('todos-page', 'todos-list')}
      className="border-accents-2 border rounded-md bg-white divide-y divide-accents-2 my-6"
    >
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
