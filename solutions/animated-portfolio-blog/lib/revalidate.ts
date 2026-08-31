// Single source of truth for the site-wide 12h ISR revalidation window.
//
// Caveat: Next.js Route Segment Config (`export const revalidate`) must be
// a literal — it cannot be imported across files (the build-time static
// analyzer rejects imported values). So the four `export const revalidate`
// statements in `app/sitemap.ts`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`,
// and `app/og/route.tsx` all duplicate the literal `43200`. This constant is
// the authoritative value for non-segment-config runtime code (the OG route's
// cache-control header) and as a grep target — search for `revalidate = 43200`
// when changing the TTL, and update the comment there too.
export const REVALIDATE_INTERVAL_SECONDS = 12 * 60 * 60; // 43200 — 12 hours

