import { registerUrql } from "@urql/next/rsc";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer, footerFragment } from "@/components/layout/footer";
import { Navigation, navigationFragment } from "@/components/layout/navigation";
import { createGraphQLClient, graphql } from "@/lib/graphql";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMS GraphQL Fragments",
  description: "A Next.js blog powered by Sanity CMS and GraphQL with ISR",
};

const GET_LAYOUT_DATA = graphql(
  `
  query GetLayoutData {
    Navigation(id: "navigation") {
      ...Navigation
    }
    Footer(id: "footer") {
      ...Footer
    }
  }
`,
  [navigationFragment, footerFragment],
);

const { getClient } = registerUrql(createGraphQLClient);

const getLayoutData = unstable_cache(
  async () => {
    const { data, error } = await getClient().query(GET_LAYOUT_DATA, {});
    if (error) {
      console.error("Layout data fetch error:", error);
      return { navigation: null, footer: null };
    }
    return {
      navigation: data?.Navigation ?? null,
      footer: data?.Footer ?? null,
    };
  },
  ["layout-data"],
  {
    tags: ["navigation", "footer"],
    revalidate: false, // Only revalidate on-demand via tags
  },
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { navigation, footer } = await getLayoutData();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {navigation && <Navigation data={navigation} />}
        <div className="p-8 pb-20 gap-16 sm:p-20">
          <main className="max-w-4xl mx-auto">{children}</main>
        </div>
        {footer && <Footer data={footer} />}
      </body>
    </html>
  );
}
