<p align="center">
  <a href="https://nextjs-flask-starter.vercel.app/">
    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
    <h3 align="center">Next.js Flask Starter</h3>
  </a>
</p>

<p align="center">Simple Next.js boilerplate that uses <a href="https://flask.palletsprojects.com/">Flask</a> as the API backend.</p>

<br/>

## Introduction

This is a hybrid Next.js + Python app that uses Next.js as the frontend and Flask as the API backend. One great use case of this is to write Next.js apps that use Python AI libraries on the backend.

## How It Works

This project uses [Vercel Services](https://vercel.com/docs/services) to deploy a Next.js frontend and a Flask backend as part of a single Vercel project. Services are configured in `vercel.json` using the `experimentalServices` key:

- **Frontend** — Next.js, mounted at `/`
- **Backend** — Flask, mounted at `/api/python`

Vercel automatically routes requests to the correct service based on the URL path prefix. It also automatically injects environment variables based on the service name to easily route between services.
To make requests to the Python backend service and keep preview environments in sync without having to hard-code urls, `NEXT_PUBLIC_BACKEND_URL` is automatically set.

## Demo

https://nextjs-flask-starter.vercel.app/

## Deploy Your Own

You can clone & deploy it to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=Next.js%20Flask%20Starter&demo-description=Simple%20Next.js%20boilerplate%20that%20uses%20Flask%20as%20the%20API%20backend.&demo-url=https%3A%2F%2Fnextjs-flask-starter.vercel.app%2F&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F795TzKM3irWu6KBCUPpPz%2F44e0c6622097b1eea9b48f732bf75d08%2FCleanShot_2023-05-23_at_12.02.15.png&project-name=Next.js%20Flask%20Starter&repository-name=nextjs-flask-starter&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fpython%2Fnextjs-flask&from=vercel-examples-repo)

## Developing Locally

You can clone & create this repo with the following command

```bash
npx create-next-app nextjs-flask --example "https://github.com/vercel/examples/tree/main/python/nextjs-flask"
```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run both services locally:

```bash
vercel dev -L
```

The `-L` flag runs all services together locally without authenticating with the Vercel Cloud. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

- [Vercel Services](https://vercel.com/docs/services) - learn how services work on Vercel.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Flask Documentation](https://flask.palletsprojects.com/) - learn about Flask features and API.
