'use client'

import { Todo } from '#/actions/todos'
import {
  useContext,
  createContext,
  experimental_useOptimistic as useOptimistic,
  type ReactNode,
} from 'react'

const todosContext = createContext<Todo[]>([])

export function useTodos() {
  const todos = useContext(todosContext)
  const [optimisticTodos, optimisticUpdate] = useOptimistic(
    todos,
    (_state: Todo[], newState: Todo[]) => newState
  )

  return [optimisticTodos, optimisticUpdate] as const
}

export function TodosProvider({
  children,
  todos,
}: {
  children: ReactNode
  todos: Todo[]
}) {
  return <todosContext.Provider value={todos}>{children}</todosContext.Provider>
}
