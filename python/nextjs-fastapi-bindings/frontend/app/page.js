"use client";

import { useState } from "react";

export default function Home() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState({ frontend: false, backend: false });

  async function call(key, url) {
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(url, { cache: "no-store" });
      setResponse(await res.json());
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
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
            <a href="/api/backend/status">Status</a>
            <a href="/api/backend/items">Items</a>
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
  <span class="key">"experimentalServicesV2"</span>: {
    <span class="key">"frontend"</span>: {
      <span class="key">"root"</span>: <span class="string">"frontend/"</span>,
      <span class="key">"framework"</span>: <span class="string">"nextjs"</span>,
      <span class="key">"bindings"</span>: [
        {
          <span class="key">"type"</span>: <span class="string">"service"</span>,
          <span class="key">"service"</span>: <span class="string">"backend"</span>,
          <span class="key">"format"</span>: <span class="string">"url"</span>,
          <span class="key">"env"</span>: <span class="string">"BACKEND_URL"</span>
        }
      ]
    },
    <span class="key">"backend"</span>: {
      <span class="key">"root"</span>: <span class="string">"backend/"</span>,
      <span class="key">"entrypoint"</span>: <span class="string">"main:app"</span>
    }
  },
  <span class="key">"rewrites"</span>: [
    { <span class="key">"source"</span>: <span class="string">"/(.*)"</span>, <span class="key">"destination"</span>: { <span class="key">"type"</span>: <span class="string">"service"</span>, <span class="key">"service"</span>: <span class="string">"frontend"</span> } }
  ]
}`,
              }}
            />
          </pre>
        </div>

        <div className="cards">
          <div className="card">
            <h3>Next.js API Route</h3>
            <p>
              Calls <code>/api/hello</code>, a route handler running on the
              Next.js frontend service.
            </p>
            <button
              onClick={() => call("frontend", "/api/hello")}
              disabled={loading.frontend}
            >
              {loading.frontend ? "Loading..." : "Call /api/hello →"}
            </button>
          </div>

          <div className="card">
            <h3>FastAPI Backend Route</h3>
            <p>
              Calls <code>/api/backend/status</code>, a Next.js proxy route
              that uses <code>BACKEND_URL</code> to reach the internal FastAPI
              service.
            </p>
            <button
              onClick={() => call("backend", "/api/backend/status")}
              disabled={loading.backend}
            >
              {loading.backend ? "Loading..." : "Call /api/backend/status →"}
            </button>
          </div>

          <div className="card">
            <h3>FastAPI Sample Data</h3>
            <p>
              Open the backend sample data proxied at{" "}
              <code>/api/backend/items</code>.
            </p>
            <a href="/api/backend/items" className="card-link">
              Open /api/backend/items →
            </a>
          </div>
        </div>

        {response && (
          <div className="response">
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </main>
    </>
  );
}
