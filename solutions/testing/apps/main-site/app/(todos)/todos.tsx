import { notFound } from 'next/navigation'
import { getUserId } from '#/actions/users'
import { getTodos } from '#/actions/todos'
import { TodoList } from './todo-list'

export async function Todos() {
  const userId = await getUserId()
  if (!userId) return notFound()

  const todos = await getTodos(userId)
  if (!todos.length) return null

  return <TodoList todos={todos} />
}
