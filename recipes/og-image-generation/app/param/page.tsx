import type { Metadata } from 'next'

export const metadata: Metadata = {
  openGraph: {
    title: 'Your page title',
    description: 'Your page description',
    url: 'https://vercel.com/',
    type: 'website',
    siteName: 'Vercel recipes',
    images: [
      {
        url: `https://${process.env.VERCEL_URL}/api/param?title=My page title`,
      },
    ],
  },
}

export default function Page() {
  return <h1>Rendering text passed as a URL param as the image</h1>
}
