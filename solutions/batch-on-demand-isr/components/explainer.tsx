import Head from 'next/head'
import React from 'react'
import {
  Text,
  Page,
  Code,
  Link,
  Button,
  LoadingDots,
} from '@vercel/examples-ui'

type Props = {
  joke?: string
}

export const Explainer: React.VFC<Props> = ({ joke }) => {
  const [loading, setLoading] = React.useState(false)
  const handleRevalidate = async () => {
    setLoading(true)
    // This should normally be called from a server and this secret value should not be exposed.
    const secret = 'PleaseWaterThePlants'
    await fetch('/api/revalidate?secret=' + secret)
    setLoading(false)
  }
  const handleRefresh = async () => {
    window.location.reload()
  }
  return (
    <Page className="flex flex-col gap-12">
      <Head>
        <title>Update multiple static pages on demand - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use batch-on-demand-isr"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Update multiple static pages on demand example</Text>
        <Text>
          This example uses On-Demand Revalidation to illustrate how you can
          update multiple pages in 1 API call. We have 3 static pages containing
          a joke. We will revalidate the pages using a single call to{' '}
          <Link href="https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation">
            our <Code>On-Demand revalidation</Code>
          </Link>{' '}
          API function. Each time we revalidate the pages, we will see a new
          joke on each page.
        </Text>

        <Text className="font-bold text-xl h-28 flex flex-col justify-center">
          My humble joke: {joke && joke}
        </Text>

        <section className="space-x-4 flex justify-center">
          <Link href="/joke/1">
            <Button>Joke 1</Button>
          </Link>
          <Link href="/joke/2">
            <Button>Joke 2</Button>
          </Link>{' '}
          <Link href="/joke/3">
            <Button>Joke 3</Button>
          </Link>
        </section>

        <section className="space-x-4 flex justify-center">
          <Button className="min-w-72" onClick={handleRevalidate}>
            {' '}
            {loading ? <LoadingDots /> : 'Get me new jokes please!'}{' '}
          </Button>
          <Button onClick={handleRefresh}>Reload the page</Button>
        </section>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">How this works</Text>
        <Text>
          Each joke page gets a joke from an API call inside its{' '}
          <Link href="https://nextjs.org/docs/basic-features/data-fetching/get-static-props">
            <Code>getStaticProps</Code>
          </Link>{' '}
          function.
        </Text>
        <Code>
          {`
export const getStaticProps: GetStaticProps = async () => {
  // Fetch your own data here
  const joke = await getContent()
  return {
    props: {
      joke,
    },
  }
}
`}
        </Code>
        <Text>
          To update all the <Code>joke</Code> static pages, we need to send an
          HTTP request to a revalidate endpoint that takes care of updating all
          the pages.
        </Text>
        <Code>{`// This should normally be called from a server and this secret value should not be exposed.
const secret = 'PleaseWaterThePlants'
fetch('/api/revalidate?secret=' + secret)
        `}</Code>
        <Text>
          Our API function will make Node&apos;s files system{' '}
          <Link href="https://nodejs.org/api/fs.html#fspromisesreaddirpath-options">
            <Code>readdir</Code>
          </Link>
          {''} method to list all the files in the directory and then update
          them all.
        </Text>
        <Code>{`
import { NextApiRequest, NextApiResponse } from 'next'
import { readdir } from 'fs/promises'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    console.log(req.query, process.env.MY_SECRET_TOKEN)
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // get all the paths we want to revalidate
    const dir = process.cwd() + '/pages/joke'
    // we will get the paths of all the files in the directory
    const files = await readdir(dir)
    // remove the extension from the file name
    const paths = files.map((file) => '/joke/' + file.replace('.tsx', ''))
    // revalidate all the paths. We won't await these promises to avoid blocking the server
    paths.forEach(res.unstable_revalidate)
    // return a success message
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
        `}</Code>
        <Text>
          You could also decide to keep an array of pages you want to edit if
          you prefer not to use the filesystem API.
        </Text>
      </section>
    </Page>
  )
}
