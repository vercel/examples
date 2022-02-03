import type { GetStaticProps } from 'next'
import Head from 'next/head'

import { Layout, Text, Page, Code, Link, List } from '@vercel/examples-ui'

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  }
}

function Home({}) {
  return (
    <Page>
      <Head>
        <title>ContentStack Commerce Demo using Next.js and Vercel</title>
        <meta
          name="description"
          content="ContentStack Commerce Demo using Next.js and Vercel"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </Page>
  )
}

Home.Layout = Layout

export default Home
