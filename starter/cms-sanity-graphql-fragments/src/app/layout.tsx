import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { LayoutComponentsWrapper } from "@/components/layout/layout-components-wrapper";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <LayoutComponentsWrapper>
          <div className="p-8 pb-20 gap-16 sm:p-20">
            <main className="max-w-4xl mx-auto">{children}</main>
          </div>
        </LayoutComponentsWrapper>
      </body>
    </html>
  );
}
