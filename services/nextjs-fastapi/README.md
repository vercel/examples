# Next.js + FastAPI Services

Minimal example showing Vercel Services with:

- `frontend` (Next.js) mounted at `/`
- `backend` (FastAPI) mounted at `/svc/api`

It demonstrates:

1. A **Next.js API route** at `/api/hello`
2. A **FastAPI backend route** at `/svc/api/status`
3. Public routes via **rewrites** in `vercel.json`

## Project structure

```txt
nextjs-fastapi/
├── backend/
│   ├── main.py
│   └── pyproject.toml
├── frontend/
│   ├── app/
│   │   ├── api/hello/route.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── next.config.js
│   └── package.json
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

- `/api/hello` (Next.js API route)
- `/svc/api/status` (FastAPI route)
