import { useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "/svc/api";

export default function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState({ status: false });

  async function call(key, url) {
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(url);
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
            Vite + FastAPI
          </a>
          <div className="nav-links">
            <a href={`${BACKEND}/status`}>Status</a>
            <a href={`${BACKEND}/items`}>Items</a>
          </div>
        </nav>
      </header>

      <main>
        <h1>Vite + FastAPI</h1>

        <div className="hero-code">
          <pre>
            <code
              dangerouslySetInnerHTML={{
                __html: `<span class="comment">// vercel.json</span>
{
  <span class="key">"services"</span>: {
    <span class="key">"frontend"</span>: {
      <span class="key">"root"</span>: <span class="string">"frontend/"</span>,
      <span class="key">"framework"</span>: <span class="string">"vite"</span>
    },
    <span class="key">"backend"</span>: {
      <span class="key">"root"</span>: <span class="string">"backend/"</span>,
      <span class="key">"entrypoint"</span>: <span class="string">"main:app"</span>
    }
  },
  <span class="key">"rewrites"</span>: [
    { <span class="key">"source"</span>: <span class="string">"/svc/api/:path*"</span>, <span class="key">"destination"</span>: { <span class="key">"type"</span>: <span class="string">"service"</span>, <span class="key">"service"</span>: <span class="string">"backend"</span> } },
    { <span class="key">"source"</span>: <span class="string">"/(.*)"</span>, <span class="key">"destination"</span>: { <span class="key">"type"</span>: <span class="string">"service"</span>, <span class="key">"service"</span>: <span class="string">"frontend"</span> } }
  ]
}`,
              }}
            />
          </pre>
        </div>

        <div className="cards">
          <div className="card">
            <h3>FastAPI Backend Route</h3>
            <p>
              Calls <code>/svc/api/status</code> directly on the FastAPI
              backend service.
            </p>
            <button
              onClick={() => call("status", `${BACKEND}/status`)}
              disabled={loading.status}
            >
              {loading.status ? "Loading..." : "Call /svc/api/status →"}
            </button>
          </div>

          <div className="card">
            <h3>FastAPI Sample Data</h3>
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
