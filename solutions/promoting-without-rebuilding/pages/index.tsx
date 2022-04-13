import Head from 'next/head'
import { Layout, Text, Page, Link, Snippet } from '@vercel/examples-ui'
import Image from 'next/image'

import redeploy from "../public/snapshot-0.jpg"
import disclaimer from "../public/snapshot-1.jpg"
import aliased from "../public/snapshot-2.jpg"

function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <Head>
        <title>Promoting without rebuilding - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use promoting without rebuilding"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Promoting without rebuilding</Text>
        <Text>
          Sometimes when we do a new release or deploy to production, we realize that something broke. It may be something small or our entire app crashing for hundreds of users. If we go to the dashboard we have an option to promote a previous deploy to production.
        </Text>
        <Image src={redeploy} alt="Vercel dashboard with deployments" />
        <Text>
          But when we promote a deploy to production, a new deploy will be created with the up to date environment variables and configurations for the project, rebuilding our project, which may take a long time depending on the project size and complexity.
        </Text>
        <Image objectFit='contain' src={disclaimer} alt="Vercel dashboard redeploy disclaimer" />
        <Text>
          Given that we need to rollback as fast as possible we can use the <Link href="https://vercel.com/cli">Vercel CLI</Link> to alias our production domain to a specific deployment.
        </Text>
        <Snippet>{`vercel alias <deployment> <domain>`}</Snippet>
        <Image src={aliased} alt="Vercel dashboard redeploy disclaimer" />
        <Text>
          That will give us some air until we found and fix the problem with our app. The next time we deploy to production (using the CLI or merging to the production branch), the alias will be overwritten and the configured production domain will point to the new deployment.
        </Text>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
