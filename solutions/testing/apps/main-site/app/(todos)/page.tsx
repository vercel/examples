import { Suspense } from 'react'
import { Page, Text } from '@vercel/examples-ui'
import { TodosProvider } from './todos-context'
import { TodoForm } from './todo-form'
import { Todos } from './todos'

export default async function Home() {
  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Testing Example
      </Text>
      <Text className="mb-4">You can now start adding Todos:</Text>
      <TodosProvider>
        <TodoForm />
        <Suspense>
          <div>
            <Todos />
          </div>
        </Suspense>
      </TodosProvider>
    </Page>
  )
}
