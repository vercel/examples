import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head />

      <body>
        <Script
          strategy="afterInteractive"
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
