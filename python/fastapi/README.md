[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Ffastapi&demo-title=FastAPI%20%2B%20Vercel&demo-description=Use%20FastAPI%20on%20vercel%20with%20Serverless%20Functions%20using%20the%20Python%20Runtime.&demo-url=https%3A%2F%2Fvercel-fastapi-deployment.vercel.app%2F&demo-image=https://assets.vercel.com/image/upload/v1669994156/random/flask.png)

# FastAPI + Vercel

This example shows how to use [FastAPI](https://fastapi.tiangolo.com/) on [Vercel](https://vercel.com) with Serverless Functions using the [Python Runtime](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python).

## Demo

- [https://vercel-fastapi-deployment.vercel.app/](https://vercel-fastapi-deployment.vercel.app/)

## How it works

This example uses the [Vercel Serverless Functions API](https://vercel.com/docs/concepts/functions/serverless-functions) to deploy a FastAPI application.

## Running Locally

Installing the requirements:

```bash
pip install -r requirements.txt
```

additionally uvicorn is required to run the server locally:

```bash
pip install uvicorn
```

Running the server:

```bash
uvicorn main:app --reload
```

Your FastAPI app should now be running on [localhost:8000](http://localhost:8000).

## One-click Deploy

Deploy your own FastAPI app with [Vercel](https://vercel.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Ffastapi&demo-title=FastAPI%20%2B%20Vercel&demo-description=Use%20FastAPI%20on%20vercel%20with%20Serverless%20Functions%20using%20the%20Python%20Runtime.&demo-url=https%3A%2F%2Fvercel-fastapi-deployment.vercel.app%2F&demo-image=https://assets.vercel.com/image/upload/v1669994156/random/flask.png)
