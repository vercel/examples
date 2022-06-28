import Head from 'next/head'

export function HeadTags() {
  const title = 'Demo: Next.js authentication at the edge with Clerk'
  const desc =
    'Try an interactive demo of authentication at the edge with Clerk and Next.js'
  const canonical = 'https://edge.clerk.app'
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:site_name" content="Clerk" />
      <meta property="og:url" content={canonical} />

      <meta
        property="og:image"
        content="https://edge.clerk.app/opengraph.png"
      />
      <meta property="og:image:width" content={1200} />
      <meta property="og:image:height" content={630} />

      <meta property="og:type" content={'website'} />

      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={desc} />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content="@ClerkDev" />
      <meta
        name="twitter:image"
        content="https://edge.clerk.app/opengraph.png"
      />
    </Head>
  )
}
