import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Transform MCP · Vercel AI SDK',
  description:
    'Chat with your documents using Unstructured Transform MCP and the Vercel AI SDK.',
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
