import Head from 'next/head'
import { Layout, Text, Page, Code, Link, Button } from '@vercel/examples-ui'
import useSwr from 'swr'

import fetchAPI from '../lib/fetchApi'
import { FC, useState } from 'react'
import { useRouter } from 'next/router'

const Snippet: FC = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

function Home() {
  const { data, error } = useSwr('/views', fetchAPI, { refreshInterval: 500 })
  const router = useRouter()
  return (
    <Page>
      <Head>
        <title>Serverside Analytics - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use Serverside Analytics"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Serverside Analytics usage example</Text>
        <Text>
          Next.js Middleware provides a great way to track page views and
          implement analytics. This example shows how to use{' '}
          <Link href="https://nextjs.org/docs/middleware">Middleware</Link> in
          order to count the number of page views. This example contains two
          pages: <Code>/</Code> and <Code>/other</Code>. We are using Middleware
          to log each visit to the pages:
        </Text>
        {}
        <ul>
          <li>
            <Text variant="description">
              Home page received {data?.home && data.home} views{' '}
              {router.asPath === '/' && '(Current page)'}
            </Text>
          </li>
          <li>
            <Text variant="description">
              Other page received {data?.other && data.other} views{' '}
            </Text>
          </li>
        </ul>
        <Text>
          <Button onClick={router.reload}>Reload Page</Button>
          <Button className="ml-4" onClick={() => router.push('/other')}>
            Switch Page
          </Button>
        </Text>
        <Text>
          Our Middleware function sends the data in a{' '}
          <Link href="https://supabase.com/" target="_blank">
            Supabase
          </Link>{' '}
          table. To keep the function light and quick, we are using their rest
          API endpoint instead of the{' '}
          <Link href="https://github.com/supabase/supabase-js" target="_blank">
            SDK
          </Link>{' '}
          to avoid the extra loading time to our function.
        </Text>
        <Snippet>
          {`
import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

async function logPageView(req: NextRequest) {
  // ignore static assets from being tracked,
  if (
    // process.env.NODE_ENV !== 'production' || // uncomment this line to track only production requests
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  //  you can track extra information such as req.geo, req.userAgent, req.headers, etc.
  const body = JSON.stringify({
    slug: req.nextUrl.pathname,
  })

  const request = await fetch(process.env.SUPABASE_URL + "/rest/v1/analytics", {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
    },
    body,
    method: 'POST',
  })

  if (request.status !== 201) {
    console.error('Error logging analytics: ', body)
  }

  return
}

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const response = NextResponse.next()
  // Runs after the response has been returned
  // so tracking analytics doesn't block rendering
  ev.waitUntil(
    (async () => {
      logPageView(req)
    })()
  )
  return response
}

`}
        </Snippet>
        <Text>
          In order to also capture client-side navigations we can make use of
          the <Code>routeChangeComplete</Code> event provided by{' '}
          <Link href="https://nextjs.org/docs/api-reference/next/router#routerevents">
            <Code>next/router</Code>
          </Link>
          .
        </Text>
        <Text variant="h2">Caveats</Text>
        <ul>
          <li>
            - If you get a lot of traffic, use an appropriate database such as a{' '}
            <Link
              href="https://en.wikipedia.org/wiki/Column-oriented_DBMS"
              target="_blank"
            >
              Column-oriented DBMS
            </Link>
            .
          </li>
          <li>
            - You can get other information about the request in the{' '}
            <Link
              href="https://nextjs.org/docs/api-reference/next/server#nextrequest"
              target="_blank"
            >
              NextRequest Object
            </Link>
            .
          </li>
        </ul>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
