# Next.js + Go Services Monorepo

Minimal example showing Vercel Services with:

- `frontend` (Next.js) mounted at `/`
- `backend` (Go + Gin) mounted at `/svc/api`

It demonstrates:

1. A **Next.js API route** at `/api/hello` (independent of backend)
2. A **Go backend route** at `/svc/api/status`
3. **Backend mounting via service routePrefix** in `vercel.json`

## Project structure

```txt
next-go-monorepo/
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go
│   ├── go.mod
│   └── go.sum
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

`vercel.json` uses `experimentalServices` to mount both services:

- `frontend` at `/`
- `backend` at `/svc/api`

## Run locally

Install frontend dependencies:

```bash
cd frontend
npm install
```

Then run all services locally:

```bash
cd ..
vercel dev -L
```

Open `http://localhost:3000` and try:

- `/api/hello` (Next.js API route)
- `/svc/api/status` (Go route)
- `/svc/api/items` (Go sample data)
