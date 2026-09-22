# Vite + Sinatra Services

Minimal example showing Vercel Services with:

- `frontend` (Vite) mounted at `/`
- `backend` (Sinatra) mounted at `/svc/api`

It demonstrates:

1. A **Sinatra backend route** at `/svc/api/status`
2. Public routes via **rewrites** in `vercel.json`

## Project structure

```txt
vite-sinatra/
├── backend/
│   ├── app.rb
│   ├── config.ru
│   └── Gemfile
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── index.css
└── vercel.json
```

## Services config

Configuration in `vercel.json`:

- routes `/(.*)` to `frontend`
- routes `/svc/api` to `backend`

The backend is a Rack app: Vercel detects Ruby from the `Gemfile` and starts it
from the `config.ru` entrypoint.

## Run locally

```bash
vercel dev
```

Open `http://localhost:3000` and try:

- `/svc/api/status` (Sinatra backend route)
