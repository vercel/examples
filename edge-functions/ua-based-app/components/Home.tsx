import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Layout, Text, Page, Code, Snippet } from '@vercel/examples-ui'

import board from '../public/board.jpg'

function Home() {
  const { route } = useRouter()
  const viewport = route.replace('/_viewport/', '')

  return (
    <Page>
      <Head>
        <title>Load pages based on users UA - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example on how to load pages based on users UA"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Load a pages based on users UA</Text>
        <Text>
          Sometimes the desktop version of our application differs a lot from
          our mobile version, because the UI is different or because we load
          different scripts, styles, etc. We want to decide which page to load
          based on users UA without loading unnecesary assets for the current
          viewport.
        </Text>
      </section>

      <section className="flex flex-col gap-6 mt-12">
        <Text variant="h2">Folder structure</Text>
        <Text>
          We will rewrite our user to different pages based on its UA so we have
          to create a different page for every viewport we want to support. Lets
          create a <Code>/_viewport</Code> folder and create a{' '}
          <Code>mobile</Code> and <Code>desktop</Code> pages.
        </Text>
        <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-4 transition-all font-mono">
          {`/pages
  /_viewport
    /mobile.(js|jsx|tsx)
    /desktop.(js|jsx|tsx)`}
        </pre>
      </section>

      <section className="flex flex-col gap-6 mt-12">
        <Text variant="h2">Checking user UA</Text>
        <Text>
          We will add a <Code>_middleware</Code> file in the root of our{' '}
          <Code>pages</Code> directory so it can handle all requests in our
          pages.
        </Text>
        <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-4 transition-all font-mono">
          {`/pages
  /_middleware.(js|ts)
  /_viewport
    /mobile.(js|jsx|tsx)
    /desktop.(js|jsx|tsx)`}
        </pre>
        <Text>
          Inside, we will check users UA and rewrite to the correct page:
        </Text>
        <Snippet>{`import { NextResponse } from 'next/server'

export function middleware(req) {
  // Clone the URL
  const url = req.nextUrl.clone()

  // Prevent internals from being accessed canonically
  if (url.pathname.startsWith(\`/_viewport\`)) {
    return new Response(null, { status: 404 })
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
          Now, everytime a request comes in we will check the UA of the user and
          rewrite it to the correct page.
        </Text>
        <Image src={board} alt="Middleware logging implementation" />
      </section>

      <section className="flex flex-col gap-6 mt-12">
        <Text variant="h2">Result</Text>
        <Text>
          In fact, this page is using this strategy, you can try this page from
          different devices and you will see the message below changing
          accordingly.
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
