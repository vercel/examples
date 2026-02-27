---
name: Cal.com booking page rewrite
slug: cal-booking-rewrite
description: Serve your Cal.com scheduling page from your main domain using Vercel project routes with CDN caching and cache tags.
framework: Next.js
useCase: Rewrites
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/cal-booking-rewrite&project-name=cal-booking-rewrite&repository-name=cal-booking-rewrite
demoUrl: https://cal-booking-rewrite.vercel.app
---

# Cal.com booking page rewrite

This template demonstrates how to serve an external scheduling page from your main domain using [Vercel project routes](https://vercel.com/docs/routing/project-routing-rules). Instead of linking users to `cal.com/your-username`, your booking page lives at `yourdomain.com/book` for a seamless brand experience.

The demo shows a fictional product site ("Beacon") where the `/book` path proxies to a Cal.com scheduling page with CDN caching and cache tags.

## Demo

https://cal-booking-rewrite.vercel.app/

Visit `/book` to see the Cal.com booking page served through the main domain.

## How to use

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/cdn/cal-booking-rewrite&project-name=cal-booking-rewrite&repository-name=cal-booking-rewrite)

### Clone and Deploy

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/cdn/cal-booking-rewrite
cd cal-booking-rewrite
pnpm install
pnpm dev
```

After deploying, visit `/book` to see the onboarding page with setup instructions.

## Set up the route

The template deploys as a Next.js app with a placeholder page at `/book`. To connect it to your scheduling platform, create a project route using the Vercel Dashboard or CLI. Project routes take effect instantly with no redeployment needed.

### Option A: Dashboard

Use the pre-filled link below to open the route creation form with the rewrite and caching headers already configured. Select your team and project, then update the destination URL with your Cal.com username.

[**Add Route**](https://vercel.com/d?to=%2F%5Bteam%5D%2F%5Bproject%5D%2Fcdn%2Frouting%2Fnew%3Froute%3D%257B%2522name%2522%253A%2522Booking%2520Page%2522%252C%2522description%2522%253A%2522Proxy%2520%252Fbook%2520to%2520Cal.com%2520scheduling%2520page%2520with%2520CDN%2520caching%2522%252C%2522path%2522%253A%2522%252Fbook%252F%253Apath*%2522%252C%2522syntax%2522%253A%2522path-to-regexp%2522%252C%2522actions%2522%253A%255B%257B%2522type%2522%253A%2522rewrite%2522%252C%2522dest%2522%253A%2522https%253A%252F%252Fcal.com%252Fyour-booking-page%252F%253Apath*%2522%257D%252C%257B%2522type%2522%253A%2522modify%2522%252C%2522subType%2522%253A%2522response-headers%2522%252C%2522headers%2522%253A%255B%257B%2522op%2522%253A%2522set%2522%252C%2522key%2522%253A%2522CDN-Cache-Control%2522%252C%2522value%2522%253A%2522public%252C%2520max-age%253D3600%252C%2520stale-while-revalidate%253D86400%2522%257D%252C%257B%2522op%2522%253A%2522set%2522%252C%2522key%2522%253A%2522Vercel-Cache-Tag%2522%252C%2522value%2522%253A%2522booking%2522%257D%255D%257D%255D%257D&title=Add%20Booking%20Page%20Route)

Or set it up manually:

1. Open your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **CDN** > **Routing**
3. Click **Create Route**
4. Configure the route:
   - **Name**: Booking Page
   - **Path**: `/book/:path*`
   - **Syntax**: path-to-regexp
   - **Action**: Rewrite
   - **Destination**: `https://cal.com/your-booking-page/:path*`
   - **Response headers** (optional, for CDN caching):
     - `CDN-Cache-Control`: `public, max-age=3600, stale-while-revalidate=86400`
     - `Vercel-Cache-Tag`: `booking`
5. Click **Save**, then test with the staging preview
6. Click **Publish** to apply the route to production

Visit `/book` on your domain. You should see your Cal.com booking page.

### Option B: CLI

```bash
vercel routes add "Booking Page" \
  --src "/book/:path*" \
  --src-syntax path-to-regexp \
  --dest "https://cal.com/your-booking-page/:path*" \
  --set-response-header "CDN-Cache-Control=public, max-age=3600, stale-while-revalidate=86400" \
  --set-response-header "Vercel-Cache-Tag=booking" \
  --yes

vercel routes publish --yes
```

Replace `your-booking-page` with your Cal.com username.

## How it works

When a user visits `/book` on your domain:

1. The request reaches Vercel's CDN
2. The project route matches `/book/:path*` and rewrites the request to your Cal.com URL
3. Cal.com responds with the booking page HTML
4. The CDN caches the response based on the `CDN-Cache-Control` header
5. The user sees your Cal.com page at `yourdomain.com/book` — the URL never changes

The CDN rewrite happens before your Next.js application runs. Once the project route is active, it replaces the placeholder onboarding page at `/book` automatically.

### CDN caching

The response header `CDN-Cache-Control: public, max-age=3600, stale-while-revalidate=86400` controls caching at the Vercel CDN only. It's stripped before reaching the browser.

- **`max-age=3600`**: The CDN considers the response fresh for 1 hour. During this time, requests are served from the cache without hitting Cal.com.
- **`stale-while-revalidate=86400`**: After the 1-hour window, the CDN serves the stale cached response immediately while fetching a fresh copy in the background. This "stale window" lasts 24 hours.

This is safe for scheduling pages because the page layout and UI are cacheable, but availability data is loaded client-side by Cal.com's JavaScript in real-time.

### Cache tags

The `Vercel-Cache-Tag: booking` header labels cached responses with an arbitrary tag. You can purge all responses tagged `booking` at once without flushing the entire project cache.

**Purge via Dashboard**: Navigate to **CDN** > **Caches**, select **Cache Tag**, enter `booking`, choose **Invalidate content**, and click **Purge**.

**Purge via API**:

```bash
curl -X POST "https://api.vercel.com/v1/projects/{projectId}/cache/purge" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -d '{"tags": ["booking"]}'
```

## In code (alternative approach)

If you prefer to manage routes in code rather than the Dashboard or CLI, rename `vercel.ts.example` to `vercel.ts` and redeploy:

```bash
mv vercel.ts.example vercel.ts
```

Set the `CAL_URL` environment variable in your Vercel project settings to point to your Cal.com page (e.g., `https://cal.com/your-booking-page`). If not set, it falls back to the demo URL.

The `vercel.ts` file configures the same rewrite and caching headers as the project route approach. The difference is that code-based routes require a new deployment to update, while project routes take effect instantly.

You can also use `vercel.json` to achieve the same result:

```json
{
  "rewrites": [
    {
      "source": "/book",
      "destination": "https://cal.com/your-booking-page"
    },
    {
      "source": "/book/:match*",
      "destination": "https://cal.com/your-booking-page/:match*"
    }
  ],
  "headers": [
    {
      "source": "/book/:match*",
      "headers": [
        {
          "key": "CDN-Cache-Control",
          "value": "public, max-age=3600, stale-while-revalidate=86400"
        },
        {
          "key": "Vercel-Cache-Tag",
          "value": "booking"
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

### Different path

Change `/book` to `/schedule`, `/demo`, or `/meeting` by updating the route's path pattern.

### Different platform

This pattern works with any scheduling platform. Swap the destination URL:

- **Calendly**: `https://calendly.com/your-username/:path*`
- **Savvycal**: `https://savvycal.com/your-username/:path*`
- **TidyCal**: `https://tidycal.com/your-username/:path*`

### Cache duration

Adjust `max-age` and `stale-while-revalidate` based on how often your booking page changes:

- **Rarely changes**: `max-age=86400, stale-while-revalidate=604800` (1 day fresh, 7 days stale)
- **Changes frequently**: `max-age=300, stale-while-revalidate=3600` (5 min fresh, 1 hour stale)
- **No caching**: Remove the `CDN-Cache-Control` and `Vercel-Cache-Tag` headers

## Key benefits

- **Unified branding**: Users stay on your domain throughout the booking flow
- **SEO**: Your booking page is indexed under your main domain
- **No CORS issues**: Content is served from your domain
- **CDN caching**: Reduce load on the scheduling platform and improve response times
- **Instant updates**: Project routes let you change the destination or caching without redeploying
