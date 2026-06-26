# Flask AI Chat with WebSocket

A real-time AI chat application using **Next.js** (frontend), **Flask** (backend), **WebSocket** for streaming, and the [Python AI SDK](https://github.com/vercel-labs/ai-python) for LLM integration. Deployed on Vercel using [Services](https://vercel.com/docs/services).

## How It Works

- The **frontend** is a Next.js single-page app with a chat UI that connects to the backend via WebSocket.
- The **backend** is a Flask server using [flask-sock](https://github.com/miguelgrinberg/flask-sock) for WebSocket support. It streams LLM responses using the Python AI SDK and sends text deltas back to the client in real time.
- On Vercel, the frontend and backend run as separate services routed by path prefix (`/` and `/api`).

### Sync handler, async SDK

Flask is WSGI and `flask-sock` handlers are **synchronous**, but the Python AI SDK is **async**. The backend bridges the two by keeping one asyncio event loop alive for the lifetime of each WebSocket connection and driving the async stream with `loop.run_until_complete(...)` per message. Reusing the loop lets the SDK's HTTP client and its pooled connections to the AI Gateway stay warm across messages in a conversation.

## How to Use

### Local Development

```bash
# Clone
npx giget@latest gh:vercel/examples/websockets/flask-ai-chat flask-ai-chat
cd flask-ai-chat

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fwebsockets%2Fflask-ai-chat&env=AI_GATEWAY_API_KEY&envDescription=Vercel%20AI%20Gateway%20API%20key)

## Project Structure

```
├── vercel.json              # Services configuration
├── backend/
│   ├── main.py              # Flask app with WebSocket endpoint
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
