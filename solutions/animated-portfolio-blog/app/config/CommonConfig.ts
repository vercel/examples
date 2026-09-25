import { IconKey } from "app/components/icons/Icons";

interface SocialLink {
  name: string;
  link: string;
  iconKey?: IconKey;
}

interface SignatureConfig {
  viewBox: string;
  /** Empty string disables the SVG signature — TopSection and the OG card
   *  skip rendering it. Leave blank unless you've exported an SVG path of
   *  your signature. */
  signaturePathD: string;
}

interface CommonConfigType {
  // Identity
  name: string;
  /** Short display name — used in the PWA webmanifest and other tight spaces. */
  shortName: string;
  /** One-line role, e.g. "Software Engineer". Used in JSON-LD and the OG card. */
  role: string;
  /** "City, Country" or similar. Empty string hides it. */
  location: string;

  // Hero (TopSection)
  heroImage: string;
  heroImageAlt: string;

  // Signature SVG (optional). TopSection animates the stroke-dasharray on this
  // path; if `signaturePathD` is empty, the signature is not rendered.
  signature: SignatureConfig;

  // Typewriter taglines in the hero. Each is shown for ~2s, then the next.
  taglines: string[];

  // About the writer (rendered at the bottom of every blog post).
  avatarImage: string;
  avatarImageAlt: string;
  writerBio: string;

  // Contact section
  email: string;
  emailSubject: string;
  emailBody: string;
  /** Shown in the Contact section — confirm wording before relying on it. */
  availability: string;

  // SEO
  /** og:site_name and PWA display label. */
  siteName: string;
  ogTitle: string;
  ogDescription: string;
  ogKeywords: string[];
  ogImageAlt: string;
  /** Default OG card title rendered by app/og/route.tsx. */
  ogFallbackTitle: string;
  /** Default OG card subtitle rendered by app/og/route.tsx. */
  ogFallbackSubtitle: string;
  /** Last-resort canonical site URL when no env var is set (dev / CI). */
  siteUrlFallback: string;

  // Social links — rendered in the hero, footer, and as the Contact CV link.
  social: SocialLink[];
}

/**
 * Resolve a social entry's link by its iconKey — the single lookup every
 * surface should use (hero buttons, footer, contact CV link), so there is
 * one place that knows how entries are keyed.
 */
export const getSocialLink = (key: IconKey): string | undefined =>
  CommonConfig.social.find((s) => s.iconKey === key)?.link;

const CommonConfig: CommonConfigType = {
  name: "Your Name",
  shortName: "Me",
  role: "Software Engineer",
  location: "",

  heroImage: "/images/avatar-placeholder.webp",
  heroImageAlt: "Your portrait",

  signature: {
    viewBox: "0 0 434 365",
    signaturePathD: "",
  },

  taglines: ["Software Engineer", "Open Source Contributor", "Tech Enthusiast"],

  avatarImage: "/images/avatar-placeholder.webp",
  avatarImageAlt: "Your Name",
  writerBio:
    "Tell visitors who you are in a sentence or two. Edit this in app/config/CommonConfig.ts.",

  email: "you@example.com",
  emailSubject: "Reaching out from your portfolio",
  emailBody: "Hi,\n\nI found your portfolio and wanted to connect about ",
  availability: "Available for new opportunities",

  siteName: "Your Name Portfolio",
  ogTitle: "Your Name | Software Engineer",
  ogDescription:
    "Your portfolio and projects. Edit app/config/CommonConfig.ts to update this and other site-wide values.",
  ogKeywords: ["portfolio", "template", "nextjs"],
  ogImageAlt: "Portfolio preview",
  ogFallbackTitle: "Your Name | Software Engineer",
  ogFallbackSubtitle: "Build · Ship · Iterate",
  siteUrlFallback: "https://example.com",

  social: [],
};

export default CommonConfig;
