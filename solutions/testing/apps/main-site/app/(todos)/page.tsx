import { Page, Text } from '@vercel/examples-ui'
import { getUserId } from '#/actions/users'
import { getTodos } from '#/actions/todos'
import { TodosForm } from './todos-form'
import { notFound } from 'next/navigation'
import { TodosProvider } from './todos-context'
import Todos from './todos'

export default async function Home() {
  const userId = await getUserId()
  if (!userId) return notFound()

  const todos = await getTodos(userId)

  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Testing Example
      </Text>
      <Text className="mb-4">You can now start adding Todos:</Text>
      <TodosProvider todos={todos}>
        <TodosForm />
        <div>
          <Todos />
        </div>
      </TodosProvider>
    </Page>
  )
}
