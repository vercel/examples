# Next.js + FastAPI Services

Minimal example showing Vercel Services with:

- `frontend` (Next.js) mounted at `/`
- `backend` (FastAPI) internal only

It demonstrates:

1. A **Next.js API route** at `/api/hello`
2. A **FastAPI backend route** which is not publicly accessible
3. Internal services via **bindings** in `vercel.json`

## Project structure

```txt
nextjs-fastapi-bindings/
├── backend/
│   ├── main.py
│   └── pyproject.toml
├── frontend/
│   ├── app/
│   │   ├── api/backend/[[...path]]/route.js
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
- binds `backend` to `frontend` as `BACKEND_URL`

## Run locally

```bash
vercel dev
```

Open `http://localhost:3000` and try:

- `/api/hello` (Next.js API route)
- `/api/backend` (FastAPI backend via Next.js API route)
