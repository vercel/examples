import { createContext, useContext, useState } from 'react'

interface Props {
  children: React.ReactNode
}

type Context = [number, React.Dispatch<React.SetStateAction<number>>]

const CounterContext = createContext({} as Context)

function CounterProvider({ children }: Props) {
  const state = useState(0)

  return (
    <CounterContext.Provider value={state}>{children}</CounterContext.Provider>
  )
}

function useCounter() {
  return useContext(CounterContext)
}

export { CounterProvider, useCounter }
