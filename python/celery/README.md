[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fcelery&demo-title=Celery%20%2B%20Vercel%20Queues&demo-description=Use%20Celery%20with%20Vercel%20Queues%20and%20Redis%20using%20the%20Python%20Runtime.&demo-url=https%3A%2F%2Fvercel-plus-celery.labs.vercel.dev%2F&demo-image=https://assets.vercel.com/image/upload/v1669994600/random/python.png)

# Celery + Vercel

This example shows how to use Celery with [Vercel Queues](https://vercel.com/docs/queues) and Redis on Vercel with Serverless Functions using the [Python Runtime](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python).

## How it Works

Celery uses a custom [Vercel Queues](https://vercel.com/docs/queues) broker to run tasks in a dedicated worker service. On Vercel, projects containing a Python worker service automatically set `CELERY_BROKER_URL` to `vercel://`, so Celery runs on top of Vercel Queues out of the box. Job status and results are stored in Redis, and a FastAPI dashboard lets you queue jobs, watch progress, and inspect results.

## Running Locally

```bash
npm i -g vercel
vercel dev
```

Your Celery application is now available at `http://localhost:3000`.

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fcelery&demo-title=Celery%20%2B%20Vercel%20Queues&demo-description=Use%20Celery%20with%20Vercel%20Queues%20and%20Redis%20using%20the%20Python%20Runtime.&demo-url=https%3A%2F%2Fvercel-plus-celery.labs.vercel.dev%2F&demo-image=https://assets.vercel.com/image/upload/v1669994600/random/python.png)
