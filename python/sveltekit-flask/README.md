<p align="center">
  <a href="https://nextjs-flask-starter.vercel.app/">
    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
    <h3 align="center">SvelteKit Flask Starter</h3>
  </a>
</p>

<p align="center">Simple Sveltekit boilerplate that uses <a href="https://flask.palletsprojects.com/">Flask</a> as the API backend.</p>

<br/>

## Introduction

This is a hybrid Sveltekit + Python app that uses Sveltekit as the frontend and Flask as the API backend. One great use case of this is to write Sveltekit apps that use Python AI libraries on the backend.

## How It Works

The Python/Flask server is mapped into to Next.js app under `/api/`.

This is implemented using [`hook.server.ts` rewrites](https://github.com/NSVEGUR/sveltekit-flask/blob/main/src/hooks.server.ts) to map any request to `/api/:path*` to the Flask API, which is hosted in the `/api` folder.

On localhost, the rewrite will be made to the `127.0.0.1:3000` port, which is where the Flask server is running.

In production, the Flask server is hosted as [Python serverless functions](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python) on Vercel.

## Demo

https://sveltekit-flask.vercel.app/

## Developing Locally

Clone this repo and dive in

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Add `.env` file and create `API_ADDRESS` and `CLIENT_API_ADDRESS` which are flask address and the client address what you want to map respectively. Sample is given in `.env.example` which can work as default.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

The Flask server will be running on [http://127.0.0.1:3000](http://127.0.0.1:3000) – feel free to change the port in `package.json` (you'll also need to update it in `.env`).

## Learn More

To learn more about Svelte and Sveltekit, take a look at the following resources:

- [Sveltekit Documentation](https://kit.svelte.dev/docs/introduction) - learn Sveltekit.
- [Learn Svelte](https://svelte.dev/tutorial/basics) - an interactive Svelte tutorial.
- [Flask Documentation](https://flask.palletsprojects.com/en/1.1.x/) - learn about Flask features and API.

You can check out [the Sveltekit GitHub repository](https://github.com/sveltejs/kit) - your feedback and contributions are welcome!
