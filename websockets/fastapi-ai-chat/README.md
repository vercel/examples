# FastAPI AI Chat with WebSocket

A real-time AI chat application using **Next.js** (frontend), **FastAPI** (backend), **WebSocket** for streaming, and the [Python AI SDK](https://github.com/vercel-labs/ai-python) for LLM integration. Deployed on Vercel using [experimental services](https://vercel.com/docs/functions/experimental-services).

## How It Works

- The **frontend** is a Next.js single-page app with a chat UI that connects to the backend via WebSocket.
- The **backend** is a FastAPI server that accepts WebSocket connections, streams LLM responses using the Python AI SDK, and sends text deltas back to the client in real time.
- On Vercel, the frontend and backend run as separate services routed by path prefix (`/` and `/svc/api`).
- Python ASGI apps handle WebSocket upgrades natively on Vercel — no `experimental_upgradeWebSocket` workaround needed.

## How to Use

### Local Development

```bash
# Clone
npx giget@latest gh:vercel/examples/websockets/fastapi-ai-chat fastapi-ai-chat
cd fastapi-ai-chat

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fwebsockets%2Ffastapi-ai-chat&env=AI_GATEWAY_API_KEY&envDescription=Vercel%20AI%20Gateway%20API%20key)

## Project Structure

```
├── vercel.json              # Services configuration
├── backend/
│   ├── main.py              # FastAPI app with WebSocket endpoint
│   ├── pyproject.toml       # Python dependencies
│   └── .python-version      # Python version
└── frontend/
    ├── app/
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
