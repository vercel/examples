'use client'

import { Button, Text } from '@vercel/examples-ui'
import { useCounter } from './providers'

export default function Counter() {
  const [counter, setCounter] = useCounter()

  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setCounter((counter) => counter - 1)}>
        Decrement
      </Button>
      <Text className="text-3xl font-black">{counter}</Text>
      <Button onClick={() => setCounter((counter) => counter + 1)}>
        Increment
      </Button>
    </div>
  )
}
