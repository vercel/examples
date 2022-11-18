'use client'

import { useState } from 'react'
import { Button } from '@vercel/examples-ui'

import Nav from './nav'

interface Props {
  translations: Record<string, string>
}

export default function Counter({ translations }: Props) {
  const [count, setCount] = useState(0)

  return (
    <div className="border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6">
      <Nav />
      <div className="flex gap-4 items-center">
        <Button
          variant="secondary"
          onClick={() => setCount((count) => count - 1)}
        >
          {translations.decrement}
        </Button>
        <span>{count}</span>
        <Button
          variant="secondary"
          onClick={() => setCount((count) => count + 1)}
        >
          {translations.increment}
        </Button>
      </div>
    </div>
  )
}
