[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fqueue-subscribers&project-name=Python%20Queue%20Subscribers&repository-name=python-queue-subscribers&demo-title=Python%20Queue%20Subscribers&demo-description=Build%20Python%20queue%20subscribers%20with%20Vercel%20Queues.&demo-url=https%3A%2F%2Fpython-queue-subscribers.labs.vercel.dev%2F)

# Python Queue Subscribers + Vercel

This example shows how to build Python subscribers with [Vercel Queues](https://vercel.com/docs/queues) and store task results in [Vercel Runtime Cache](https://vercel.com/docs/runtime-cache) using [FastAPI](https://fastapi.tiangolo.com/).

## Demo

https://python-queue-subscribers.labs.vercel.dev/

## How it Works

The FastAPI app publishes addition and multiplication tasks with `AsyncQueueClient`. The subscriber configuration in `pyproject.toml` points to the queue client in `worker.py`, while the decorated handlers in `tasks.py` process messages from the `add` and `multiply` topics. Results are shared through a local SQLite file during development and Vercel Runtime Cache when deployed. The dashboard polls for each task until its result is available.

## Running Locally

```bash
npm i -g vercel
vercel dev
```

The application is now available at `http://localhost:3000`.

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fqueue-subscribers&project-name=Python%20Queue%20Subscribers&repository-name=python-queue-subscribers&demo-title=Python%20Queue%20Subscribers&demo-description=Build%20Python%20queue%20subscribers%20with%20Vercel%20Queues.&demo-url=https%3A%2F%2Fpython-queue-subscribers.labs.vercel.dev%2F)
