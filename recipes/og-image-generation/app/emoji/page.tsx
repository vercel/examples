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
        url: '/api/emoji',
      },
    ],
  },
}

export default function Page() {
  return <h1>Rendering an emoji in the image</h1>
}
