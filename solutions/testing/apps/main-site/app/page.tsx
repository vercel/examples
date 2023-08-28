import { Page, Text } from '@vercel/examples-ui'
// import useSWR from 'swr'
import { getUserId } from '#/actions/users'
import { getTodos } from '#/actions/todos'
import { tid } from '../lib/data-testid'
import { TodosForm } from './todos-form'
import { TodoItem } from './todo-item'
import { notFound } from 'next/navigation'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default async function Home() {
  // const { data, error, mutate } = useSWR('/api/todo', fetcher)
  const userId = await getUserId()
  if (!userId) return notFound()

  const todos = await getTodos(userId)
  console.log('TODOS', todos)

  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Testing Example
      </Text>
      <Text className="mb-4">You can now start adding Todos:</Text>
      <TodosForm />
      <div>
        {todos.length ? (
          <ul
            data-testid={tid('todos-page', 'todos-list')}
            className="border-accents-2 border rounded-md bg-white divide-y divide-accents-2 my-6"
          >
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        ) : null}
      </div>
    </Page>
  )
}
