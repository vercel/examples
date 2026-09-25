---
name: Multi-tenant blog platform with Neon
slug: platforms-blog-neon
description: A Platforms-style multi-tenant blog where each tenant gets a subdomain, powered end to end by Neon Postgres, Auth, Data API, and Object Storage.
framework: Next.js
useCase: Starter
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/platforms-blog-neon&project-name=platforms-blog-neon&repo-name=platforms-blog-neon&env=NEXT_PUBLIC_NEON_AUTH_URL,NEXT_PUBLIC_NEON_DATA_API_URL,DATABASE_URL,NEON_JWKS_URL,NEXT_PUBLIC_ROOT_DOMAIN,AWS_ENDPOINT_URL_S3,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,AWS_S3_BUCKET
demoUrl: https://platforms-blog-neon.vercel.app
relatedTemplates:
  - platforms-starter-kit
  - domains-api
---

# Multi-tenant blog platform with Neon

A [Platforms](https://vercel.com/docs/platforms)-style, multi-tenant app with [Neon](https://neon.com) powering the entire backend. A user signs up, creates a site, and that site gets its own subdomain (`acme.yourapp.com`) serving a public blog. It runs entirely on Neon and Vercel:

- **Serverless Postgres** stores the sites and posts.
- **Neon Auth** handles sign in, sign up, and sessions.
- **Data API** is the PostgREST-compatible query layer the dashboard uses.
- **Neon Object Storage** holds post cover images over an S3-compatible API.
- **Vercel** as the deployment and hosting platform.

## Demo

[https://platforms-blog-neon.vercel.app/](https://platforms-blog-neon.vercel.app/)

## Environment variables

Copy `.env.example` to `.env.local` and set these (all come from the Neon
Console):

| Variable                                     | Scope   | Purpose                                                                                |
| -------------------------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_NEON_AUTH_URL`                  | browser | Neon Auth service URL                                                                  |
| `NEXT_PUBLIC_NEON_DATA_API_URL`              | browser | Data API (PostgREST) URL for the dashboard                                             |
| `NEXT_PUBLIC_ROOT_DOMAIN`                    | browser | Domain tenants live under (`localhost:3000` locally, your domain in production)        |
| `DATABASE_URL`                               | server  | Direct connection, used to render public blogs and to apply `db/schema.sql`            |
| `NEON_JWKS_URL`                              | server  | Verifies the JWT on image uploads (usually the auth URL plus `/.well-known/jwks.json`) |
| `AWS_ENDPOINT_URL_S3`                        | server  | Neon Object Storage endpoint                                                           |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | server  | Object Storage credentials                                                             |
| `AWS_REGION`                                 | server  | Object Storage region, e.g. `us-east-2`                                                |
| `AWS_S3_BUCKET`                              | server  | Bucket that holds cover images                                                         |

## Deploy your own

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/platforms-blog-neon&project-name=platforms-blog-neon&repo-name=platforms-blog-neon&env=NEXT_PUBLIC_NEON_AUTH_URL,NEXT_PUBLIC_NEON_DATA_API_URL,DATABASE_URL,NEON_JWKS_URL,NEXT_PUBLIC_ROOT_DOMAIN,AWS_ENDPOINT_URL_S3,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION,AWS_S3_BUCKET)

Point a wildcard DNS record (`*.yourapp.com`) at Vercel so tenant subdomains
resolve.

### Clone and run locally

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/platforms-blog-neon platforms-blog-neon
```

1. In the [Neon Console](https://console.neon.tech), create a project and enable **Neon Auth**, the **Data API**, and **Object Storage** (create a bucket).
2. Copy `.env.example` to `.env.local` and fill in the values (all are shown in the Neon Console). Locally, leave `NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000` so tenant subdomains like `acme.localhost:3000` resolve automatically.
3. Apply the schema once:

   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```

   (or paste [`db/schema.sql`](./db/schema.sql) into the Neon SQL Editor).

4. Start the app and open http://localhost:3000:

   ```bash
   pnpm dev
   ```

   Create a site, write a post, publish it, then visit `http://<subdomain>.localhost:3000`.

## A branch per preview deployment

Connect your project with the [Neon integration on Vercel](https://neon.com/docs/guides/vercel-overview) and every preview deployment is wired to its own **Neon branch**, a copy-on-write clone of the database, its auth and storage, so each pull request gets an isolated backend to test against.

## Built on open source

- [Next.js](https://nextjs.org) (App Router) as the React framework
- [Tailwind](https://tailwindcss.com/) for CSS styling
- [Neon](https://neon.com) for Postgres, Auth, the Data API, and Object Storage
- [Vercel](http://vercel.com/) for deployment
