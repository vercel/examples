import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CometChat × Vercel — Add chat in one prompt",
  description:
    "Next.js starter with CometChat AI-coding skills pre-installed. Open your AI agent and ask 'add chat to my app'.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
