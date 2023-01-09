import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="Generate an AI-generated image with a description."
        />
        <meta
          property="og:image"
          content="https://dalle-2.vercel.app/ogimage.png"
        />
        <meta
          name="twitter:image"
          content="https://dalle-2.vercel.app/ogimage.png"
        />
        <meta
          property="og:description"
          content="Generate an AI-generated image with a description."
        />
        <meta
          name="twitter:description"
          content="Generate an AI-generated image with a description."
        />
        <meta property="og:site_name" content="dalle-2.vercel.app" />
        <meta name="keywords" content="AI, text2image, dalle, dall-e, openai" />
        <meta property="og:title" content="Dall-E 2 AI Image Generator" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dall-E 2 AI Image Generator" />
      </Head>
      <body className="bg-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
