import { FC } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { Layout, Text, Page, Link, Code } from '@vercel/examples-ui'

import board from '../public/board.jpg'

const Snippet: FC = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

function Home() {
  return (
    <Page>
      <Head>
        <title>Logging - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example on how to use logging on middleware"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Logging from the edge</Text>
        <Text>
          Logging gives us visibility on usage, errors, etc. The edge has plenty
          of information about the request and logging calls are often
          non-blocking, so this makes the Edge a perfect place for implementing
          logging. All we have to do is call our logging API using fetch from
          our <Code>_middleware</Code> file:
        </Text>
        <Snippet>
          {`// Regex for public files
const PUBLIC_FILE = /\.(.*)$/

export default function middleware(req) {
  // Only log for visited pages
  if (!PUBLIC_FILE.test(req.nextUrl.pathname)) {
    // We fire and forget this request to avoid blocking the request until completion
    // and let logging occur in the background
    fetch('https://in.logtail.com', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${process.env.LOGTAIL_TOKEN}\`
      },
      body: JSON.stringify({
        message: 'Log from the edge',
        nested: {
          page: req.nextUrl.href,
          referrer: req.referrer,
          ua: req.ua?.ua,
          geo: req.geo
        }
      })
    })
  }
}`}
        </Snippet>
        <Image src={board} alt="Middleware logging implementation" />
        <Text>
          This way our call will not block the execution (because we do not want
          to block the request until completion as we do not need the response)
          while logging the information in our service of choice. This example
          uses{' '}
          <Link target="_blank" href="https://logtail.com/">
            Logtail
          </Link>{' '}
          but you can use whatever service you like as soon as it has a
          rest-based approach or an edge compatible SDK.
        </Text>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
