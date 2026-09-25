# Next.js + FastAPI Queues

Minimal example showing [Vercel Services](https://vercel.com/docs/services)
with [Vercel Queues](https://vercel.com/docs/queues):

- `frontend` (Next.js) mounted at `/`
- `backend` (FastAPI) mounted at `/api/python`

It demonstrates:

1. Next.js publishing a message for a Python subscriber
2. Python publishing a message for a Next.js callback
3. Next.js publishing one message to both runtimes

## How it works

Each producer creates a task before publishing a message. The queue delivers
the message to the configured subscriber, which stores its result in
[Vercel Runtime Cache](https://vercel.com/docs/runtime-cache). The frontend
polls the FastAPI service until every expected subscriber has completed.

The fanout example uses separate consumer groups for the Next.js callback and
Python subscriber, so both receive a copy of the same message.

## Project structure

```txt
cross-runtime-queues/
├── backend/       # FastAPI producer, subscribers, and result store
├── frontend/      # Next.js UI, producers, and queue callbacks
└── vercel.json    # Service routing and Next.js queue triggers
```

## Services config

Configuration in `vercel.json`:

- routes `/(.*)` to `frontend`
- routes `/api/python/(.*)` to `backend`
- binds `backend` to `frontend` as `BACKEND_URL`
- registers the Next.js callbacks as `queue/v2beta` triggers

Python subscribers are configured in `backend/pyproject.toml`.

## Run locally

Install the frontend and Python dependencies:

```bash
cd frontend
npm install
cd ../backend
python -m venv .venv
source .venv/bin/activate
pip install -e .
cd ..
```

Start the development server:

```bash
npx vercel dev
```

The application is now available at `http://localhost:3000`.
