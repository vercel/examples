# FastAPI AI Chat with WebSocket over Service Bindings

A real-time AI chat application using **Next.js** (frontend), **FastAPI** (backend), **WebSocket** for streaming, and the [Python AI SDK](https://github.com/vercel-labs/ai-python) for LLM integration. Deployed on Vercel using [Services](https://vercel.com/docs/services), with the backend reachable only through a service binding.

This is the same app as [`fastapi-ai-chat`](../fastapi-ai-chat), except the backend is internal and the frontend relays the WebSocket to it.

## How It Works

- The **frontend** is a Next.js single-page app with a chat UI that opens a WebSocket to `/api/ws`, a Next.js route that relays frames to the backend using `experimental_upgradeWebSocket` from `@vercel/functions`.
- The **backend** is a FastAPI server that accepts WebSocket connections, streams LLM responses using the Python AI SDK, and sends text deltas back to the client in real time.
- On Vercel, all public traffic is routed to the frontend. The backend has no public route; the frontend reaches it through a service binding exposed as `BACKEND_URL`.

```
browser ──ws──▶ frontend (Next.js, /api/ws relay) ──ws──▶ backend (FastAPI, internal)
```

## How to Use

### Local Development

```bash
# Clone
npx giget@latest gh:vercel/examples/websockets/fastapi-ai-chat-bindings fastapi-ai-chat-bindings
cd fastapi-ai-chat-bindings

# Set your AI Gateway API key
echo "AI_GATEWAY_API_KEY=your-key-here" > .env

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && uv sync && cd ..

# Run both services
vercel dev -L
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fwebsockets%2Ffastapi-ai-chat-bindings&env=AI_GATEWAY_API_KEY&envDescription=Vercel%20AI%20Gateway%20API%20key)

## Project Structure

```
├── vercel.json              # Services and bindings configuration
├── backend/
│   ├── main.py              # FastAPI app with WebSocket endpoint
│   ├── pyproject.toml       # Python dependencies
│   └── .python-version      # Python version
└── frontend/
    ├── app/
    │   ├── api/ws/route.js   # WebSocket relay to the backend
    │   ├── page.js           # Chat UI (client component)
    │   ├── layout.js         # Root layout
    │   └── globals.css       # Styling
    ├── next.config.js
    └── package.json
```

## Environment Variables

| Variable | Description |
|---|---|
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway API key (required) |
| `AI_MODEL` | Model to use (default: `anthropic/claude-sonnet-4-6`) |

## WebSocket Protocol

Client → Server:
```json
{ "type": "message", "messages": [{ "role": "user", "content": "Hello" }] }
```

Server → Client:
```json
{ "type": "text_delta", "content": "chunk of text" }
{ "type": "text_done" }
{ "type": "error", "content": "error description" }
```

The client sends the full conversation history with each message, making the backend stateless per-connection.

## Trade-offs

Compared to [`fastapi-ai-chat`](../fastapi-ai-chat), every open chat holds two functions (the frontend relay and the backend) for its lifetime, and adds an extra hop. In exchange, the backend is not publicly routable, and the frontend can add auth, rate limiting, or validation before anything reaches it.
