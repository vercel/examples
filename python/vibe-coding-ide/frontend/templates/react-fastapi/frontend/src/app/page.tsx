const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function fetchApi() {
  const res = await fetch(`${API_BASE}/`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to fetch API: ${res.status}`)
  }
  return res.json()
}

async function fetchItems() {
  const res = await fetch(`${API_BASE}/items`, { cache: 'no-store' })
  if (!res.ok) {
    return [] as {
      id: number
      name: string
      price: number
      description?: string
    }[]
  }
  return res.json()
}

export default async function Page() {
  const apiRoot = await fetchApi()
  const items = await fetchItems()

  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1>Next.js + FastAPI</h1>
      <p>
        Backend says: <code>{apiRoot.message}</code>
      </p>

      <h2 style={{ marginTop: 24 }}>Items</h2>
      {items.length === 0 ? (
        <p>No items (or API not reachable)</p>
      ) : (
        <ul>
          {items.map((item: any) => (
            <li key={item.id}>
              {item.name} - ${''}
              {item.price.toFixed(2)}{' '}
              {item.description ? `(${item.description})` : ''}
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: 24, color: '#666' }}>
        Configure API URL with <code>NEXT_PUBLIC_API_URL</code> (defaults to
        http://localhost:8000)
      </p>
    </main>
  )
}
