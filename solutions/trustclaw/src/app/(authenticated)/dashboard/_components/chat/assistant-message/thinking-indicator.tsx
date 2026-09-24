'use client'

import { useState, useEffect } from 'react'
import { THINKING_WORDS } from './thinking-words'

export function ThinkingIndicator() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % THINKING_WORDS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="py-2">
      <span className="text-muted-foreground animate-pulse text-sm font-medium">
        {THINKING_WORDS[index]}...
      </span>
    </div>
  )
}
