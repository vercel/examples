---
name: API proxy rewrite
slug: api-proxy-rewrite
description: Proxy an external API through your domain using Vercel project routes with CDN caching and cache tags.
framework: Next.js
useCase: Rewrites
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite&project-name=api-proxy-rewrite&repository-name=api-proxy-rewrite
demoUrl: https://api-proxy-rewrite.vercel.app
---

# API proxy rewrite

This template demonstrates how to proxy an external API through your domain using [Vercel project routes](https://vercel.com/docs/routing/project-routing-rules) with CDN caching and cache tags. No code changes or redeployment needed.

The demo shows a fictional product site ("Beacon") where the `/blog` page fetches posts from `/api/external/posts`, which is proxied to an external API ([JSONPlaceholder](https://jsonplaceholder.typicode.com)) via a project route. Before the route is configured, the blog page shows an onboarding guide. After the route is active, posts appear automatically.

## Demo

https://api-proxy-rewrite.vercel.app/

Visit `/blog` to see blog posts fetched from an external API through the CDN proxy.

## How to use

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite&project-name=api-proxy-rewrite&repository-name=api-proxy-rewrite)

### Clone and Deploy

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite
cd api-proxy-rewrite
pnpm install
pnpm dev
```

After deploying, visit `/blog` to see the onboarding page with setup instructions.

## Set up the route

The template deploys as a Next.js app. The `/blog` page fetches from `/api/external/posts`, but this path returns a 404 until you create a project route to proxy it to your API. Project routes take effect instantly with no redeployment needed.

### Option A: Dashboard

Use the pre-filled link below to open the route creation form with the rewrite and caching headers already configured. Select your team and project, then update the destination URL if you want to use a different API.

[**Add Route**](https://vercel.com/d?to=%2F%5Bteam%5D%2F%5Bproject%5D%2Fcdn%2Frouting%2Fnew%3Froute%3D%257B%2522name%2522%253A%2522Blog%2520API%2520Proxy%2522%252C%2522description%2522%253A%2522Proxy%2520%252Fapi%252Fexternal%2520to%2520blog%2520API%2520with%2520CDN%2520caching%2522%252C%2522path%2522%253A%2522%252Fapi%252Fexternal%252F%253Apath*%2522%252C%2522syntax%2522%253A%2522path-to-regexp%2522%252C%2522actions%2522%253A%255B%257B%2522type%2522%253A%2522rewrite%2522%252C%2522dest%2522%253A%2522https%253A%252F%252Fjsonplaceholder.typicode.com%252F%25241%2522%257D%252C%257B%2522type%2522%253A%2522modify%2522%252C%2522subType%2522%253A%2522response-headers%2522%252C%2522headers%2522%253A%255B%257B%2522op%2522%253A%2522set%2522%252C%2522key%2522%253A%2522CDN-Cache-Control%2522%252C%2522value%2522%253A%2522public%252C%2520max-age%253D60%252C%2520stale-while-revalidate%253D3600%2522%257D%252C%257B%2522op%2522%253A%2522set%2522%252C%2522key%2522%253A%2522Vercel-Cache-Tag%2522%252C%2522value%2522%253A%2522api%2522%257D%255D%257D%255D%257D&title=Add%20Blog%20API%20Proxy%20Route)

Or set it up manually:

1. Open your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **CDN** > **Routing**
3. Click **Create Route**
4. Configure the route:
   - **Name**: Blog API Proxy
   - **Path**: `/api/external/:path*`
   - **Syntax**: path-to-regexp
   - **Action**: Rewrite
   - **Destination**: `https://jsonplaceholder.typicode.com/$1`
   - **Response headers** (optional, for CDN caching):
     - `CDN-Cache-Control`: `public, max-age=60, stale-while-revalidate=3600`
     - `Vercel-Cache-Tag`: `api`
5. Click **Save**, then test with the staging preview
6. Click **Publish** to apply the route to production

Visit `/blog` on your domain. You should see blog posts appear.

### Option B: CLI

```bash
vercel routes add "Blog API Proxy" \
  --src "/api/external/:path*" \
  --src-syntax path-to-regexp \
  --dest "https://jsonplaceholder.typicode.com/$1" \
  --set-response-header "CDN-Cache-Control=public, max-age=60, stale-while-revalidate=3600" \
  --set-response-header "Vercel-Cache-Tag=api" \
  --yes

vercel routes publish --yes
```

## How it works

When a user visits `/blog`:

1. The Next.js app renders the blog page and fetches `/api/external/posts`
2. The request reaches Vercel's CDN
3. The project route matches `/api/external/:path*` and rewrites the request to `https://jsonplaceholder.typicode.com/posts`
4. JSONPlaceholder responds with JSON data
5. The CDN caches the response based on the `CDN-Cache-Control` header
6. The blog page renders the post data

The CDN rewrite happens transparently. Your frontend code fetches from `/api/external/posts` as if it were a local API — no CORS issues, no exposing backend URLs to the client.

### Why `/api/external`?

We use `/api/external` instead of `/api` to avoid conflicting with [Next.js API routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) at `/api/`. You can change this to any path that doesn't conflict with your existing routes.

### CDN caching

The response header `CDN-Cache-Control: public, max-age=60, stale-while-revalidate=3600` controls caching at the Vercel CDN only. It's stripped before reaching the browser.

- **`max-age=60`**: The CDN considers the response fresh for 1 minute. During this time, requests are served from the cache without hitting the external API.
- **`stale-while-revalidate=3600`**: After the 1-minute window, the CDN serves the stale cached response immediately while fetching a fresh copy in the background. This "stale window" lasts 1 hour.

### Cache tags

The `Vercel-Cache-Tag: api` header labels cached responses with an arbitrary tag. You can purge all responses tagged `api` at once without flushing the entire project cache.

**Purge via Dashboard**: Navigate to **CDN** > **Caches**, select **Cache Tag**, enter `api`, choose **Invalidate content**, and click **Purge**.

**Purge via API**:

```bash
curl -X POST "https://api.vercel.com/v1/projects/{projectId}/cache/purge" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -d '{"tags": ["api"]}'
```

## In code (alternative approach)

If you prefer to manage routes in code rather than the Dashboard or CLI, rename `vercel.ts.example` to `vercel.ts` and redeploy:

```bash
mv vercel.ts.example vercel.ts
```

Set the `API_URL` environment variable in your Vercel project settings to point to your API (e.g., `https://jsonplaceholder.typicode.com`). If not set, it falls back to the demo URL.

The `vercel.ts` file configures the same rewrite and caching headers as the project route approach. The difference is that code-based routes require a new deployment to update, while project routes take effect instantly.

You can also use `vercel.json` to achieve the same result:

```json
{
  "rewrites": [
    {
      "source": "/api/external/:match*",
      "destination": "https://jsonplaceholder.typicode.com/:match*"
    }
  ],
  "headers": [
    {
      "source": "/api/external/:match*",
      "headers": [
        {
          "key": "CDN-Cache-Control",
          "value": "public, max-age=60, stale-while-revalidate=3600"
        },
        {
          "key": "Vercel-Cache-Tag",
          "value": "api"
        }
      ]
    }
  ]
}
```

## When to use each approach

| Approach | Best for | Updates require |
| --- | --- | --- |
| Dashboard | Non-technical users, one-off setup, instant changes | Click "Publish" |
| CLI | CI/CD pipelines, scripting, automation | Run command |
| `vercel.ts` | Version-controlled config with env vars, TypeScript projects | New deployment |
| `vercel.json` | Version-controlled config, no extra dependencies | New deployment |

## Customization

### Different API

Swap `jsonplaceholder.typicode.com` for your own backend, CMS API, or any external API. Common examples:

- Your own backend: `https://api.yourcompany.com/:path*`
- Headless CMS: `https://cdn.contentful.com/spaces/your-space/:path*`
- Third-party service: `https://api.stripe.com/:path*`

### Different path

Change `/api/external` to `/backend`, `/data`, `/proxy`, or any path that doesn't conflict with your existing routes.

### Cache duration

Adjust `max-age` and `stale-while-revalidate` based on how often your API data changes:

- **Rarely changes**: `max-age=3600, stale-while-revalidate=86400` (1 hour fresh, 1 day stale)
- **Changes frequently**: `max-age=10, stale-while-revalidate=60` (10 sec fresh, 1 min stale)
- **No caching**: Remove the `CDN-Cache-Control` and `Vercel-Cache-Tag` headers

### Request headers

Use transforms to add authentication headers to proxied requests (e.g., `Authorization: Bearer $API_TOKEN`). This keeps API keys on the server and out of your client-side code.

## Key benefits

- **No CORS issues**: API is served from your domain
- **CDN caching**: Reduce load on your backend and improve response times
- **Instant updates**: Project routes let you change the destination API or caching without redeploying
- **Unified domain**: No exposing backend URLs to the client
- **Cache tags**: Purge specific cached API responses without flushing everything
