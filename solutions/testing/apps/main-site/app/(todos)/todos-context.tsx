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
  useEffect,
} from 'react'

type TodoContext = {
  todos: Todo[]
  loading: boolean
  optimisticUpdate: (todos: Todo[]) => void
}

const setTodosContext = createContext<(todos: Todo[]) => void>(() => {})
const todosContext = createContext<TodoContext>({
  todos: [],
  loading: true,
  optimisticUpdate: () => {},
})

export function useTodos() {
  return useContext(todosContext)
}

export function useSetTodos() {
  return useContext(setTodosContext)
}

export function useInitTodos(todos: Todo[]) {
  const setTodos = useContext(setTodosContext)
  // Populate the client-side state of todos. This enables client components to
  // read the todos from context.
  useEffect(() => {
    setTodos(todos)
  }, [todos, setTodos])
}

const updateTodos = (_state: Todo[], newState: Todo[]) => newState

/**
 * Todos provider. In order to set the todos in the context the `setTodos` function needs to be used.
 */
export function TodosProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [todosState, setTodosState] = useState<Todo[]>([])
  const [todos, optimisticUpdate] = useOptimistic(todosState, updateTodos)
  const setTodos = useCallback(
    (newTodos: Todo[]) => {
      setLoading(false)
      setTodosState(newTodos)
    },
    [setTodosState]
  )
  const value = useMemo(
    () => ({ loading, todos, optimisticUpdate }),
    [loading, todos, optimisticUpdate]
  )

  return (
    <setTodosContext.Provider value={setTodos}>
      <todosContext.Provider value={value}>{children}</todosContext.Provider>
    </setTodosContext.Provider>
  )
}
