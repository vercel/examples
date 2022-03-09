import Head from 'next/head'
import { Layout, Page } from '@vercel/examples-ui'

import { Screen } from '../components/screen'

function Home() {
  return (
    <Page>
      <Head>
        <title>Server-side Analytics at the edge</title>
        <meta
          name="description"
          content="Learn how to do server-side analytics at the edge"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Screen />
    </Page>
  )
}

Home.Layout = Layout

export default Home
