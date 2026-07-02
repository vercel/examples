import "./globals.css";

export const metadata = {
  title: "Next.js + Gin Services Demo",
  description: "Vercel Services example with Next.js frontend and Gin backend.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
