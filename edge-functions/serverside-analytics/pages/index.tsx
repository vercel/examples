import Head from 'next/head'
import { Layout, Page } from '@vercel/examples-ui'

import { Screen } from '../components/screen'

function Home() {
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
      <Screen />
    </Page>
  )
}

Home.Layout = Layout

export default Home
