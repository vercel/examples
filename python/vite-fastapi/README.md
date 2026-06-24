# Vite + FastAPI Services Monorepo

Minimal example showing Vercel Services with:

- `frontend` (Vite) mounted at `/`
- `backend` (FastAPI) mounted at `/svc/api`

It demonstrates:

1. A **FastAPI backend route** at `/svc/api/status`
2. Public routes via **rewrites** in `vercel.json`

## Project structure

```txt
vite-fastapi/
├── backend/
│   ├── main.py
│   └── pyproject.toml
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

## Run locally

```bash
vercel dev
```

Open `http://localhost:3000` and try:

- `/svc/api/status` (FastAPI route)
- `/svc/api/docs` (FastAPI Swagger UI)
