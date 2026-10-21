import "./global.css";
import type { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Varela_Round, Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Tooltip from "@/app/components/tooltip";
import Footer from "./components/Footer/Footer";
import { baseUrl } from "./sitemap";
import Menu from "./components/Menu/Menu";
import ThemeInitializerScript from "./ThemeInitializerScript";
import SoundInitializerScript from "./SoundInitializerScript";
import GoogleAnalyticsScript from "./GoogleAnalyticsScript";
import ShaderBackground from "./components/ShaderBackground/ShaderBackground";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import SmoothScroll from "./components/SmoothScroll/SmoothScroll";
import ScrollProgress from "./components/ScrollProgress/ScrollProgress";
import CommonConfig from "./config/CommonConfig";

// Viewport — Next.js 13+ requires themeColor/colorScheme here, not in Metadata.
// Media queries let mobile browser chrome adapt to the user's OS theme.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f131a" },
  ],
  colorScheme: "light dark",
};

const defaultOgImage = `/og?title=${encodeURIComponent(CommonConfig.ogTitle)}`;

// JSON-LD `sameAs` is derived from CommonConfig.social so the two never drift.
// Only entries that look like a profile URL (http(s)://, no mailto) are kept,
// and the field is omitted entirely when the array is empty — Google's Rich
// Results Test warns on `"sameAs": []`, so an absent key is cleaner than an
// empty array.
const sameAsProfiles = CommonConfig.social
  .filter((s) => /^https?:\/\//.test(s.link))
  .map((s) => s.link);

// Layout Metadata
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: CommonConfig.ogTitle,
    template: `%s | ${CommonConfig.name}`,
  },
  description: CommonConfig.ogDescription,
  authors: [{ name: CommonConfig.name, url: baseUrl }],
  creator: CommonConfig.name,
  applicationName: CommonConfig.siteName,
  keywords: CommonConfig.ogKeywords,
  openGraph: {
    title: CommonConfig.ogTitle,
    description: CommonConfig.ogDescription,
    url: baseUrl,
    siteName: CommonConfig.siteName,
    locale: "en_US",
    type: "website",
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: baseUrl,
    title: CommonConfig.ogTitle,
    description: CommonConfig.ogDescription,
    images: [
      {
        url: defaultOgImage,
        alt: CommonConfig.ogImageAlt,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    // Schema.org Structured Data
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: CommonConfig.name,
      description: CommonConfig.role,
      url: baseUrl,
      ...(sameAsProfiles.length > 0 ? { sameAs: sameAsProfiles } : {}),
    }),
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

// Layout Fonts
// 1. Configure the font loaders
const varelaRound = Varela_Round({
  weight: "400", // Varela Round typically only has a 400 weight
  subsets: ["latin"],
  display: "swap", // Use 'swap' to ensure text is visible immediately
  variable: "--font-varela-round", // Assign a CSS variable name
});

// Variable display grotesque used for the hero name. Loading without a fixed
// weight pulls the variable font (full wght axis) so we can drive font-weight
// from motion values in TopSection.
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={clsx(varelaRound.variable, bricolageGrotesque.variable)}>
      <head>
        <ThemeInitializerScript />
        <SoundInitializerScript />
      </head>
      <body className="flex min-h-screen flex-col">
        <ShaderBackground />
        <SmoothScroll />
        <ScrollProgress />
        <CustomCursor />
        <Tooltip />
        {/* flex-col so the 404 page can use `flex-1` on its section to fill
           the available space (viewport height minus footer) instead of
           pushing the footer below the fold. Non-404 pages don't set
           flex-1 on their content, so the layout is unchanged for them. */}
        <main className="flex flex-1 flex-col">
          <Menu />
          {children}
          <Analytics />
          <GoogleAnalyticsScript />
          <SpeedInsights />
        </main>
        <Footer />
      </body>
    </html>
  );
}
