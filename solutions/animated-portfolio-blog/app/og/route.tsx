import { ImageResponse } from "next/og";
import CommonConfig from "@/app/config/CommonConfig";
import { REVALIDATE_INTERVAL_SECONDS } from "@/lib/revalidate";

// Dynamic OG card generator. Renders a branded dark card (matches the site's
// sci-fi aesthetic) with the signature SVG, the page/post title, and a name +
// role footer. Title + subtitle come from query params so the same template
// serves the home page and each blog post.
//
// Satori (next/og's renderer) requires explicit `display: flex` on every div
// with children and plain `style` objects — Tailwind `tw=` classes work but
// `style` is more reliable for layered layouts. Custom fonts would require an
// edge-compatible font fetch; the signature SVG carries enough branding that
// the system sans is fine.
//
// ISR revalidate matches the blog routes (12h) so a single rendered card is
// reused across crawlers/share previews; the cache-control header does the
// same for downstream CDNs (Vercel respects it for the edge cache).
//
// 43200 is duplicated across sitemap.ts, blog/page.tsx, blog/[slug]/page.tsx
// — Next.js requires literals here; see lib/revalidate.ts for the source of
// truth. The cache-control header below imports the constant (runtime code
// is not subject to the segment-config literal restriction).
export const revalidate = 43200;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || CommonConfig.ogFallbackTitle;
  const subtitle = searchParams.get("subtitle") || CommonConfig.ogFallbackSubtitle;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0f131a",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Brand-blue accent bar across the top */}
      <div style={{ height: 10, width: "100%", backgroundColor: "#3c83f6", display: "flex" }} />

      {/* Signature + content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          padding: "0 80px",
        }}
      >
        {/* Signature glyph — the strongest piece of visual identity.
            Empty signaturePathD skips the SVG so the layout doesn't reserve
            space for an invisible glyph. Matches TopSection's behavior. */}
        {CommonConfig.signature.signaturePathD && (
          <svg
            viewBox={CommonConfig.signature.viewBox}
            style={{ width: 220, height: 185, marginBottom: 20 }}
          >
            <path d={CommonConfig.signature.signaturePathD} fill="#3c83f6" />
          </svg>
        )}

        {/* Title (page name or blog post title) */}
        <div
          style={{
            color: "#fafafa",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            display: "flex",
          }}
        >
          {title}
        </div>

        {/* Subtitle / tagline */}
        <div
          style={{
            color: "#adadad",
            fontSize: 30,
            marginTop: 18,
            display: "flex",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Footer: name + role */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 80px 50px",
          color: "#3c83f6",
          fontSize: 26,
          letterSpacing: 1,
        }}
      >
        {CommonConfig.name} · {CommonConfig.role}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "cache-control": `public, s-maxage=${REVALIDATE_INTERVAL_SECONDS}, stale-while-revalidate=604800`,
      },
    }
  );
}
