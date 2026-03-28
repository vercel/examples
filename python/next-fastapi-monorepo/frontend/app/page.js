'use client'

import { useState } from 'react'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || '/svc/api'

export default function Home() {
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState({
    frontend: false,
    backend: false,
    direct: false,
    crossProject: false,
  })

  async function call(key, url) {
    setLoading((prev) => ({ ...prev, [key]: true }))
    setResponse(null)
    setError(null)
    try {
      const res = await fetch(url, { cache: 'no-store' })
      const contentType = res.headers.get('content-type') || ''
      const isJson = contentType.includes('application/json')
      const body = isJson ? await res.json() : await res.text()

      if (!res.ok) {
        setError({ status: res.status, statusText: res.statusText, url, body })
      } else {
        setResponse(body)
      }
    } catch (err) {
      setError({ message: err.message, url })
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  return (
    <>
      <header>
        <nav>
          <a href="/" className="logo">
            Next.js + FastAPI
          </a>
          <div className="nav-links">
            <a href={`${BACKEND}/docs`}>API Docs</a>
            <a href={`${BACKEND}/items`}>API</a>
          </div>
        </nav>
      </header>

      <main>
        <h1>Next.js + FastAPI</h1>

        <div className="hero-code">
          <pre>
            <code
              dangerouslySetInnerHTML={{
                __html: `<span class="comment">// vercel.json</span>
{
  <span class="key">"experimentalServices"</span>: {
    <span class="key">"frontend"</span>: {
      <span class="key">"entrypoint"</span>: <span class="string">"frontend"</span>,
      <span class="key">"routePrefix"</span>: <span class="string">"/"</span>
    },
    <span class="key">"backend"</span>: {
      <span class="key">"entrypoint"</span>: <span class="string">"backend/main.py"</span>,
      <span class="key">"routePrefix"</span>: <span class="string">"/svc/api"</span>
    }
  }
}`,
              }}
            />
          </pre>
        </div>

        <div className="cards">
          <div className="card card--warning">
            <h3>Next.js → External Project</h3>
            <p>
              Calls <code>/api/cross-project</code>, a Next.js route that
              fetches an endpoint on a separate Vercel project. Fails with{' '}
              <code>401 Unauthorized</code> when deployment protection is
              enabled.
            </p>
            <button
              onClick={() => call('crossProject', '/api/cross-project')}
              disabled={loading.crossProject}
              className="button--warning"
            >
              {loading.crossProject ? 'Loading...' : 'Call external project →'}
            </button>
          </div>

          <div className="card card--warning">
            <h3>Next.js → FastAPI Direct</h3>
            <p>
              Calls <code>/api/direct-fastapi</code>, a Next.js route that
              fetches <code>/status</code> directly from the FastAPI service
              URL. Fails with <code>401 Unauthorized</code> when deployment
              protection is enabled.
            </p>
            <button
              onClick={() => call('direct', '/api/direct-fastapi')}
              disabled={loading.direct}
              className="button--warning"
            >
              {loading.direct ? 'Loading...' : 'Call via Next.js route →'}
            </button>
          </div>
        </div>

        {response && (
          <div className="response">
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}

        {error && (
          <div className="response response--error">
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}
      </main>
    </>
  )
}
