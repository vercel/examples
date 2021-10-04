import { FC } from 'react'
import NextHead from 'next/head'

const Head: FC = () => {
  return (
    <>
      <NextHead>
        <title>Vercel Edge Functions - IP Blocking with Datadome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" key="site-manifest" />
        <meta name="theme-color" content="#000" />
        <meta name="msapplication-TileColor" content="#000000" />
      </NextHead>
    </>
  )
}

export default Head
