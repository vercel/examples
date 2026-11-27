import { getMediumPosts } from "@/lib/medium";
import CommonConfig from "@/app/config/CommonConfig";

// Resolves the canonical site URL. Priority:
//   1. NEXT_PUBLIC_SITE_URL   — set explicitly on Vercel Production
//   2. NEXT_PUBLIC_VERCEL_URL — manual override (rarely needed)
//   3. VERCEL_URL              — auto-injected by Vercel on every deploy
//                               (bare hostname, no protocol — prefixed here)
//   4. CommonConfig.siteUrlFallback — generic placeholder so dev/CI runs
//
// All candidates are normalized to include an https:// prefix before return,
// because `new URL(baseUrl)` (used by Next.js metadataBase) throws on
// protocol-less input. VERCEL_URL is always bare, and a misconfigured
// NEXT_PUBLIC_VERCEL_URL (e.g. set to "$VERCEL_URL" which Vercel expands to
// a bare hostname) would otherwise break the build.
function resolveBaseUrl(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (!candidate) return CommonConfig.siteUrlFallback;

  return /^https?:\/\//.test(candidate) ? candidate : `https://${candidate}`;
}

export const baseUrl = resolveBaseUrl();

// 12h. Duplicated across blog/page.tsx, blog/[slug]/page.tsx, og/route.tsx —
// Next.js requires literals here; see lib/revalidate.ts for the source of truth.
export const revalidate = 43200;

export default async function sitemap() {
  const posts = await getMediumPosts();
  const blogs = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date
      ? new Date(post.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  }));

  const routes = ["", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
