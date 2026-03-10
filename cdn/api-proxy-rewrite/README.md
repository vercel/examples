---
name: API proxy rewrite
slug: proxy-requests-to-external-origins
description: Proxy an external API through your domain using vercel.ts with CDN caching and cache tags.
framework: Next.js
useCase: CDN
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite&project-name=api-proxy-rewrite&repository-name=api-proxy-rewrite&utm_source=github&utm_medium=readme&utm_campaign=vercel-examples
demoUrl: https://api-proxy-rewrite-project-routing.vercel.app
---

# API proxy rewrite

Proxy an external API through your domain using `vercel.ts`. Requests to `/api/external/:path*` are rewritten to your backend, cached at the CDN, and tagged for targeted purging.

## Demo

https://api-proxy-rewrite-project-routing.vercel.app/

Visit `/blog` to see blog posts fetched from an external API through the CDN proxy.

## How to use

### One-Click Deploy

Deploy the template on [Vercel](https://vercel.com/?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) using [this link](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite&project-name=api-proxy-rewrite&repository-name=api-proxy-rewrite&utm_source=github&utm_medium=readme&utm_campaign=vercel-examples).

To proxy your own API instead of the demo, set the `EXTERNAL_API_URL` environment variable in your project settings and redeploy. By default, the template uses `jsonplaceholder.typicode.com` as the external API.

### Clone and Deploy

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/cdn/api-proxy-rewrite
cd api-proxy-rewrite
pnpm install
pnpm dev
```

## How it works

The rewrite and caching configuration lives in [`vercel.ts`](./vercel.ts):

```ts
import type { VercelConfig } from '@vercel/config/v1'

const EXTERNAL_API_URL =
  process.env.EXTERNAL_API_URL || 'https://jsonplaceholder.typicode.com'

export const config: VercelConfig = {
  framework: 'nextjs',
  outputDirectory: '.next',
  rewrites: [
    {
      source: '/api/external/:path*',
      destination: `${EXTERNAL_API_URL}/:path*`,
    },
  ],
  headers: [
    {
      source: '/api/external/:path*',
      headers: [
        { key: 'CDN-Cache-Control', value: 'public, max-age=60, stale-while-revalidate=3600' },
        { key: 'Vercel-Cache-Tag', value: 'api' },
      ],
    },
  ],
}
```

1. The Next.js app renders the blog page and fetches `/api/external/posts`
2. The rewrite in `vercel.ts` matches `/api/external/:path*` and proxies the request to your configured backend
3. The `CDN-Cache-Control` header caches responses at the edge for 1 minute, with a 1-hour stale-while-revalidate window
4. The `Vercel-Cache-Tag` header tags responses with `api` for targeted cache purging

### CDN caching

`CDN-Cache-Control` controls caching at the Vercel CDN only. Unlike `Cache-Control`, which affects both the browser and CDN, `CDN-Cache-Control` is stripped before reaching the browser.

- **`max-age=60`**: The CDN serves cached responses for 1 minute without hitting the external API.
- **`stale-while-revalidate=3600`**: After the 1-minute window, the CDN serves stale content immediately while fetching a fresh copy in the background.

### Cache tags

`Vercel-Cache-Tag: api` labels cached responses with a tag. You can purge all responses tagged `api` without flushing the entire project cache:

- **Dashboard**: Navigate to **CDN** > **Caches**, select **Cache Tag**, enter `api`, and click **Purge**
- **API**:

```bash
curl -X POST "https://api.vercel.com/v1/edge-cache/invalidate-by-tags?projectIdOrName=your-project-id" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tags": ["api"]}'
```

## No-code alternative

If you prefer to configure routing without code or redeployment, you can use [project level routing rules](https://vercel.com/docs/routing/project-routing-rules) through the Vercel Dashboard, CLI, API, or SDK. See the [Add API External Rewrite Routing Rule](https://vercel.com/templates/template/add-api-external-rewrite-routing-rule) template for a no-code approach.

## Key benefits

- **No CORS issues**: API is served from your domain
- **CDN caching**: Responses are cached at Vercel's edge network, reducing load on your backend
- **Version-controlled routing**: Rewrite configuration lives in code alongside your app
- **Unified domain**: Backend URLs are never exposed to the client
- **Cache tags**: Purge specific cached responses without flushing everything
- **Resilience**: The CDN serves cached responses even if your backend is temporarily unavailable
