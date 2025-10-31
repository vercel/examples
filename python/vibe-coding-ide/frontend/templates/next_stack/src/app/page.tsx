'use client'
import React from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

function useStatus() {
  const [ping, setPing] = React.useState('pending')
  const [health, setHealth] = React.useState('pending')
  React.useEffect(() => {
    fetch(`${API_BASE}/api/ping`)
      .then((r) => r.json())
      .then((d) => setPing(d?.message || JSON.stringify(d)))
      .catch((err) => setPing(`error: ${err.message}`))
    fetch(`${API_BASE}/api/health`)
      .then((r) => r.json())
      .then((d) => setHealth(d?.status || JSON.stringify(d)))
      .catch((err) => setHealth(`error: ${err.message}`))
  }, [])
  return { ping, health } as const
}

export default function Page() {
  const { ping, health } = useStatus()
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[12px] row-start-2 items-center sm:items-start">
        <h1 className="text-xl font-semibold">Next.js (Stack)</h1>
        <div className="text-sm">
          <div>
            <strong>/api/ping</strong>: {String(ping)}
          </div>
          <div>
            <strong>/api/health</strong>: {String(health)}
          </div>
        </div>
      </main>
    </div>
  )
}
