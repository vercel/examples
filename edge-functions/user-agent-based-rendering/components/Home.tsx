import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Layout, Text, Page, Code, Link, Snippet } from '@vercel/examples-ui'

import board from '../public/board.jpg'

function Home() {
  const { route } = useRouter()
  const viewport = route.replace('/_viewport/', '')

  return (
    <Page>
      <Head>
        <title>User-Agent Based Rendering - Vercel Example</title>
        <meta
          name="description"
          content="Learn to use the User-Agent header to render different pages"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">User-Agent Based Rendering</Text>
        <Text>
          Sometimes the desktop version of our application differs a lot from
          our mobile version, because the UI is different or because we load
          different scripts, styles, etc. We want to decide which page to load
          based on the{' '}
          <Link
            href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent"
            target="_blank"
          >
            User-Agent
          </Link>{' '}
          header without loading unnecesary assets for the current viewport.
        </Text>
      </section>

      <section className="flex flex-col gap-6 mt-12">
        <Text variant="h2">Folder structure</Text>
        <Text>
          We will rewrite our user to different pages based on its User-Agent so
          we need to have a different page for every viewport we want to
          support.
        </Text>
        <Text>
          The example has a <Code>pages/_viewport</Code> folder with pages for{' '}
          <Code>mobile</Code> and <Code>desktop</Code>, alongside a root
          middleware (<Code>pages/_middleware</Code>) that will handle all
          requests to our pages:
        </Text>
        <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-4 transition-all font-mono">
          {`/pages
  /_middleware.ts
  /_viewport
    /mobile.tsx
    /desktop.tsx`}
        </pre>
      </section>

      <section className="flex flex-col gap-6 mt-12">
        <Text variant="h2">Checking the User-Agent</Text>
        <Text>
          In the middleware, we now check the User-Agent header and rewrite to
          the correct page:
        </Text>
        <Snippet>{`import { NextRequest, NextResponse } from 'next/server'

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/

export function middleware(req) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Skip public files
  if (PUBLIC_FILE.test(url.pathname)) return

  // Prevent internals from being accessed canonically
  if (url.pathname.startsWith(\`/_viewport\`)) {
    url.pathname = '/404'
    return NextResponse.rewrite(url)
  }

  // Check the viewport
  const viewport = ['android', 'ios'].includes(req.ua?.os.name?.toLowerCase()!)
    ? 'mobile'
    : 'desktop'

  // Update the expected url
  url.pathname = \`_viewport/\${viewport}\${url.pathname}\`

  // Return rewrited response
  return NextResponse.rewrite(url)
}
`}</Snippet>
        <Text>
          Now, everytime a request comes in we will check the User-Agent and
          rewrite the user to the correct page:
        </Text>
        <Image src={board} alt="Middleware logging implementation" />
      </section>

      <section className="flex flex-col gap-6 mt-12">
        <Text variant="h2">Result</Text>
        <Text>
          This page is using this strategy, try it out in different devices and
          you will see the message below changing accordingly:
        </Text>
      </section>

      <p className="bg-black text-white font-mono text-center p-6 rounded-lg text-lg leading-6 mt-12">
        This page was loaded on a <b>{viewport}</b> device.
      </p>
    </Page>
  )
}

Home.Layout = Layout

export default Home
