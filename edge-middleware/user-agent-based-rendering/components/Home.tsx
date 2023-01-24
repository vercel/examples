import { useRouter } from 'next/router'
import Image from 'next/image'
import { Layout, Text, Page, Code, Link, Snippet } from '@vercel/examples-ui'

import board from '../public/board.jpg'

function Home() {
  const { route } = useRouter()
  const viewport = route.replace('/_viewport/', '')

  return (
    <Page>
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
          middleware (<Code>/middleware.js</Code>) that will handle all requests
          to our pages:
        </Text>
        <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-4 transition-all font-mono">
          {`/middleware.ts
/pages
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
        <Snippet>{`import { NextRequest, NextResponse, userAgent } from 'next/server'

// Set pathname where middleware will be executed
export const config = {
  matcher: '/',
}

export function middleware(req) {
  // Parse user agent
  const { device } = userAgent(req)

  // Check the viewport
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'

  // Update the expected url
  req.nextUrl.pathname = \`_viewport/\${viewport}\`

  // Return rewrited response
  return NextResponse.rewrite(req.nextUrl)
}`}</Snippet>
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
