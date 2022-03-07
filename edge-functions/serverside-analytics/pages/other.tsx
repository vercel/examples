import Head from 'next/head'
import { Layout, Page } from '@vercel/examples-ui'
import useSwr from 'swr'

import { useRouter } from 'next/router'
import fetchAPI from '../lib/fetchApi'

import { Screen } from '../components/screen'

function Other() {
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
      <Screen />
    </Page>
  )
}

Other.Layout = Layout

export default Other
