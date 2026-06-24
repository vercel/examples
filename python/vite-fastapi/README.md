# Vite + FastAPI Services Monorepo

Minimal example showing Vercel Services with:

- `frontend` (Vite) mounted at `/`
- `backend` (FastAPI) mounted at `/svc/api`

It demonstrates:

1. A **FastAPI backend route** at `/svc/api/status`
2. **Backend mounting via service routePrefix** in `vercel.json`

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

`vercel.json` uses `experimentalServicesV2` to mount both services:

- `frontend` at `/`
- `backend` at `/svc/api`

## Run locally

Install frontend dependencies:

```bash
cd frontend
npm install
```

Then run all services via Vercel local runtime:

```bash
cd ..
vercel dev -L
```

Open `http://localhost:3000` and try:

- `/svc/api/status` (FastAPI route)
- `/svc/api/docs` (FastAPI Swagger UI)
