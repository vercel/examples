import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react'

type CounterContext = [number, Dispatch<SetStateAction<number>>]

const Counter = createContext<CounterContext>([0, () => {}])

function CounterProvider({ children }: { children: ReactNode }) {
  const state = useState(0)
  return <Counter.Provider value={state}>{children}</Counter.Provider>
}

const useCounter = () => useContext(Counter)

export { CounterProvider, useCounter }
