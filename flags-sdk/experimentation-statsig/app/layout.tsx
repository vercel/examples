import { Analytics } from '@vercel/analytics/next';
import { VercelToolbar } from '@vercel/toolbar/next';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Shirt Shop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body className="">
        {children}

        {shouldInjectToolbar && <VercelToolbar />}
        <Analytics />
      </body>
    </html>
  );
}
