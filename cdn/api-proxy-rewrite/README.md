---
name: API proxy rewrite
slug: api-proxy-rewrite
description: Proxy an external API through your domain using Vercel project routes with CDN caching and cache tags.
framework: Next.js
useCase: CDN
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite&project-name=api-proxy-rewrite&repository-name=api-proxy-rewrite&utm_source=github&utm_medium=readme&utm_campaign=vercel-examples
demoUrl: https://api-proxy-rewrite-project-routing.vercel.app
---

# API proxy rewrite

Proxy an external API through your domain using [Vercel project routes](https://vercel.com/docs/routing/project-routing-rules) with CDN caching and cache tags.

Deploy the demo app, then set up a project route through the Dashboard or CLI to proxy `/api/external/posts` to an external API without any code changes or redeployment.

## Demo

https://api-proxy-rewrite-project-routing.vercel.app/

Visit `/blog` to see blog posts fetched from an external API through the CDN proxy.

## How to use

### One-Click Deploy

Deploy the template using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite&project-name=api-proxy-rewrite&repository-name=api-proxy-rewrite&utm_source=github&utm_medium=readme&utm_campaign=vercel-examples)

### Clone and Deploy

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite
cd api-proxy-rewrite
pnpm install
pnpm dev
```

After deploying, visit `/blog` to see the onboarding page with setup instructions.

## Set up the route

The `/blog` page fetches from `/api/external/posts`, but this path returns a 404 until you create a project route to proxy it to your API. Project routes take effect instantly — no redeployment needed.

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
   - **Action**: Rewrite
   - **Destination**: `https://jsonplaceholder.typicode.com/$1`
   - **Response headers** (optional, for CDN caching):
     - `CDN-Cache-Control`: `public, max-age=60, stale-while-revalidate=3600`
     - `Vercel-Cache-Tag`: `api`
5. Click **Save**, then test with the staging preview
6. Click **Publish** to apply the route to production

The source path uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) syntax where `:path*` is a named wildcard. The destination uses `$1` to reference the first captured group from the source pattern.

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

1. The Next.js app renders the blog page and fetches `/api/external/posts`
2. The request reaches Vercel's CDN
3. The project route matches `/api/external/:path*` and rewrites the request to your configured API endpoint (e.g., `https://jsonplaceholder.typicode.com/posts`)
4. The external API responds with JSON data
5. The CDN caches the response based on the `CDN-Cache-Control` header and tags it with `Vercel-Cache-Tag`
6. The blog page renders the data

Your frontend code fetches from `/api/external/posts` as if it were a local API. The CDN rewrite is transparent — no CORS issues, no exposing backend URLs to the client.

### CDN caching

`CDN-Cache-Control` controls caching at the Vercel CDN only. Unlike `Cache-Control`, which affects both the browser and CDN, `CDN-Cache-Control` is stripped before reaching the browser. API consumers always fetch fresh data from the CDN, while the CDN caches responses to reduce load on your backend.

- **`max-age=60`**: The CDN serves cached responses for 1 minute without hitting the external API.
- **`stale-while-revalidate=3600`**: After the 1-minute window, the CDN serves stale content immediately while fetching a fresh copy in the background. This stale window lasts 1 hour.

If your API experiences downtime, the CDN continues serving cached responses during the stale-while-revalidate window.

### Cache tags

`Vercel-Cache-Tag: api` labels cached responses with a tag. You can purge all responses tagged `api` without flushing the entire project cache.

**Purge via Dashboard**: Navigate to **CDN** > **Caches**, select **Cache Tag**, enter `api`, choose **Invalidate content**, and click **Purge**.

**Purge via API**:

```bash
curl -X POST "https://api.vercel.com/v1/edge-cache/invalidate-by-tags?projectIdOrName=your-project-id" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tags": ["api"]}'
```

## In code (alternative approach)

If you prefer to manage routes in code rather than the Dashboard or CLI, rename `vercel.ts.example` to `vercel.ts` and redeploy. Set the `API_URL` environment variable in your project settings to point to your API (e.g., `https://jsonplaceholder.typicode.com`). If not set, it falls back to the demo URL.

Code-based routes require a new deployment to update, while project routes take effect instantly.

You can also use `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/external/:path*",
      "destination": "https://jsonplaceholder.typicode.com/:path*"
    }
  ],
  "headers": [
    {
      "source": "/api/external/:path*",
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

## Key benefits

- **No CORS issues**: API is served from your domain
- **CDN caching**: Responses are cached at Vercel's edge network, reducing load on your backend
- **Instant updates**: Change the destination API or caching without redeploying
- **Unified domain**: Backend URLs are never exposed to the client
- **Cache tags**: Purge specific cached responses without flushing everything
- **Resilience**: The CDN serves cached responses even if your backend is temporarily unavailable
