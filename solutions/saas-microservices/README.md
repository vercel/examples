# SaaS Microservices

This is an example SaaS project with 2 API services defined as microservices.

## Getting Started

```sh
pnpm install
pnpm dev
```

Open http://localhost:3024 to view the dashboard. The dashboard will make API calls
to the `users` and `dashboard` microservices for the information to display in the
dashboard.

## How It Works

There are 3 separate applications in this example:

- `dashboard` - A [Next.js](https://nextjs.org/) application to show the UI.
- `api-dashboard` - A [Nitro](https://nitro.build/) backend serving data displayed in the dashboard.
- `api-users` - A [Hono](https://hono.dev/) backend authenticating users and returning user information.

These all run under the same domain. Paths to each application are routed using Vercel's [microfrontends](https://vercel.com/docs/microfrontends) support:

- `/api/dashboard/*` - Routes to the `api-dashboard` backend
- `/api/users/*` - Routes to the `api-users` backend
- Everything else - Routes to the `dashboard` application
