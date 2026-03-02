import "./globals.css";

export const metadata = {
  title: "Next.js + Go Services Demo",
  description: "Vercel Services example with Next.js frontend and Go backend.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
