[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fcelery&project-name=Python%20Celery%20Starter&repository-name=python-celery-starter&demo-title=Python%20Celery%20Starter&demo-description=Deploy%20Python%20Celery%20workers%20using%20Vercel%20Queues.&demo-url=https%3A%2F%2Fvercel-plus-celery.labs.vercel.dev%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1Sol5L2cpAqe5gh7IbEtLY%2F40a6478fedeea79ef4dd217e113068eb%2Fvercel-celery.png&skippable-integrations=1&stores=%255B%257B%2522type%2522%253A%2522integration%2522%252C%2522group%2522%253A%2522redis%2522%257D%255D)

# Celery + Vercel

This example shows how to use Celery with [Vercel Queues](https://vercel.com/docs/queues) and Redis on Vercel with Serverless Functions using the [Python Runtime](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python).

## Demo

https://vercel-plus-celery.labs.vercel.dev/

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fcelery&project-name=Python%20Celery%20Starter&repository-name=python-celery-starter&demo-title=Python%20Celery%20Starter&demo-description=Deploy%20Python%20Celery%20workers%20using%20Vercel%20Queues.&demo-url=https%3A%2F%2Fvercel-plus-celery.labs.vercel.dev%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1Sol5L2cpAqe5gh7IbEtLY%2F40a6478fedeea79ef4dd217e113068eb%2Fvercel-celery.png&skippable-integrations=1&stores=%255B%257B%2522type%2522%253A%2522integration%2522%252C%2522group%2522%253A%2522redis%2522%257D%255D)
