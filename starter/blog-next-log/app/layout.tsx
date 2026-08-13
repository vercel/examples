import "~styles/globals.css";
import { Metadata } from "next";
import Header from "~components/header";
import ThemeProvider from "~styles/themeProvider";
import { getConfig } from "~lib/config";
import GoogleAnalytics from "~components/GoogleAnalytics";

const config = getConfig();

export const metadata: Metadata = {
  metadataBase: new URL(config.url || "http://localhost:3000"),
  title: {
    default: config.title,
    template: `%s | ${config.title}`,
  },
  description: config.description,
  authors: [{ name: config.author.name }],
  icons: {
    icon: [
      { url: "/favicon-light.svg", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    siteName: config.title,
    title: config.title,
    description: config.description,
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description: config.description,
  },
  ...(config.googleVerification && {
    verification: { google: config.googleVerification },
  }),
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      suppressHydrationWarning
      lang={config.language || "en"}
      style={{ "--primary": config.theme.primaryColor } as React.CSSProperties}
    >
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`,
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: config.title,
              description: config.description,
              url: config.url,
            }),
          }}
        />
        {config.googleAnalyticsId && (
          <GoogleAnalytics gaId={config.googleAnalyticsId} />
        )}
        <ThemeProvider>
          <Header />
          <div className="flex w-full justify-center">
            <main id="main-content" className="container relative lg:px-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
