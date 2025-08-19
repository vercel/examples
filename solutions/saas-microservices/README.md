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

- `dashboard` - A [Next.js](https://nextjs.org/) application to show the UI. This application also controls the `microfrontends.json` configuration to route API paths to the other microservices (see below).
- `api-dashboard` - A [Nitro](https://nitro.build/) backend serving data displayed in the dashboard.
- `api-users` - A [Hono](https://hono.dev/) backend authenticating users and returning user information.

These all run under the same domain. Paths to each application are routed using Vercel's [microfrontends](https://vercel.com/docs/microfrontends) support:

```mermaid
graph TD
    Request --> Vercel{Vercel}

    Vercel -->|"/api/dashboard/*"| ApiDashboard[api-dashboard]
    Vercel -->|"/api/users/*"| ApiUsers[api-users]
    Vercel -->|"Everything else"| DashboardApp[Dashboard]
```

## Running Locally

To run all applications together, run:

```sh
pnpm dev
```

A [local development proxy](https://vercel.com/docs/microfrontends/local-development) is automatically run to stitch requests from each application to the local instance of each service.

A single or subset of applications can also be run:

```sh
pnpm dev:dashboard
pnpm dev:api-dashboard
pnpm dev:api-users
pnpm turbo run dev -F api-users -F api-dashboard
```
