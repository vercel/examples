import React from 'react'

function useStatus() {
  const [ping, setPing] = React.useState('pending')
  const [health, setHealth] = React.useState('pending')
  React.useEffect(() => {
    fetch('/api/ping')
      .then((r) => r.json())
      .then((d) => setPing(d?.message || JSON.stringify(d)))
      .catch(() => setPing('error'))
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHealth(d?.status || JSON.stringify(d)))
      .catch(() => setHealth('error'))
  }, [])
  return { ping, health } as const
}

export default function App() {
  const { ping, health } = useStatus()
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>React (Stack)</h1>
      <p>Connectivity:</p>
      <ul>
        <li>/api/ping: {String(ping)}</li>
        <li>/api/health: {String(health)}</li>
      </ul>
    </div>
  )
}
