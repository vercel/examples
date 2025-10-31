import {
  PrefetchCrossZoneLinks,
  PrefetchCrossZoneLinksProvider,
} from '@vercel/microfrontends/next/client';
import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toolbar } from './client-scripts';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vercel Microfrontends - Revolutionize Your Frontend',
  description:
    'Build scalable and maintainable web applications with our microfrontend architecture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrefetchCrossZoneLinksProvider>
          {children}
        </PrefetchCrossZoneLinksProvider>
        <PrefetchCrossZoneLinks />
        <SpeedInsights />
        <Analytics />
        <Toolbar />
      </body>
    </html>
  );
}
