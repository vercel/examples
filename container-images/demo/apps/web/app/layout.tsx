import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dockerfile Runtime - Services",
  description:
    "Multiple container services running on Vercel, routed via vercel.json.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
