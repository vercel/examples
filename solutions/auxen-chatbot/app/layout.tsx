import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auxen Chat Starter",
  description:
    "Next.js + Vercel AI SDK chatbot starter wired to an Auxen dedicated LLM endpoint.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
