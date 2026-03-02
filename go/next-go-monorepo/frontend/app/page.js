"use client";

import { useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "/svc/api";

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
            Next.js + Go
          </a>
          <div className="nav-links">
            <a href={`${BACKEND}/status`}>Status</a>
            <a href={`${BACKEND}/items`}>Items</a>
          </div>
        </nav>
      </header>

      <main>
        <h1>Next.js + Go</h1>

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
      <span class="key">"entrypoint"</span>: <span class="string">"backend/cmd/api/main.go"</span>,
      <span class="key">"routePrefix"</span>: <span class="string">"/svc/api"</span>
    }
  }
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
            <h3>Go Backend Route</h3>
            <p>
              Calls <code>/svc/api/status</code> directly on the Go backend
              service.
            </p>
            <button
              onClick={() => call("backend", `${BACKEND}/status`)}
              disabled={loading.backend}
            >
              {loading.backend ? "Loading..." : "Call /svc/api/status →"}
            </button>
          </div>

          <div className="card">
            <h3>Go Sample Data</h3>
            <p>
              Open the backend sample data endpoint at{" "}
              <code>/svc/api/items</code>.
            </p>
            <a href={`${BACKEND}/items`} className="card-link">
              Open /svc/api/items →
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
