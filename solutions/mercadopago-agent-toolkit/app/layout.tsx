import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mercado Pago Agent Toolkit",
  description:
    "Agent that drives Mercado Pago billing flows via @ar-agents/mercadopago tools and Vercel AI SDK 6.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "#0a0a0a",
          color: "#ededed",
        }}
      >
        {children}
      </body>
    </html>
  );
}
