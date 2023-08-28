'use client'

import { Todo } from '#/actions/todos'
import {
  type ReactNode,
  useContext,
  createContext,
  experimental_useOptimistic as useOptimistic,
  useState,
  useMemo,
  useCallback,
} from 'react'

type TodoContext = {
  todos: Todo[]
  loading: boolean
  setTodos: (todos: Todo[]) => void
}

const todosContext = createContext<TodoContext>({
  todos: [],
  setTodos: () => {},
  loading: true,
})

export function useTodos() {
  const { todos, loading } = useContext(todosContext)
  const [optimisticTodos, optimisticUpdate] = useOptimistic(
    todos,
    (_state: Todo[], newState: Todo[]) => newState
  )

  return [optimisticTodos, loading, optimisticUpdate] as const
}

export function useSetTodos() {
  const { setTodos } = useContext(todosContext)
  return setTodos
}

/**
 * Todos provider. In order to set the todos in the context the `setTodos` function needs to be used.
 */
export function TodosProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [todos, setTodosFn] = useState<Todo[]>([])
  const setTodos = useCallback(
    (todos: Todo[]) => {
      setLoading(false)
      setTodosFn(todos)
    },
    [setTodosFn]
  )
  const value = useMemo(
    () => ({ todos, setTodos, loading }),
    [loading, todos, setTodos]
  )

  return <todosContext.Provider value={value}>{children}</todosContext.Provider>
}
