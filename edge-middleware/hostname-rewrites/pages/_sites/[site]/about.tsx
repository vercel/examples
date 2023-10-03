import Head from 'next/head'
import { useRouter } from 'next/router'
import { Layout, Page, Text, Link } from '@vercel/examples-ui'

import { getHostnameDataBySubdomain, getSubdomainPaths } from '../../../lib/db'

export default function About(props) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <Page>
        <Text variant="h1" className="mb-6">
          Loading...
        </Text>
      </Page>
    )
  }

  return (
    <Page>
      <Text variant="h1" className="mb-6">
        About {props.name}
      </Text>
      <div className="mb-4">
        <Link className="mr-2.5" href="/">
          Home
        </Link>
        <Link href="/about">About</Link>
      </div>
      <Text className="mb-2">
        <b>Properties</b>: {props.description}
      </Text>
      <Text className="mb-2">
        <b>Subdomain</b>: {props.subdomain}.vercel.sh
      </Text>
      <Text className="mb-2">
        <b>Custom Domain</b>: {props.customDomain || 'none'}
      </Text>
    </Page>
  )
}

About.Layout = Layout

export async function getStaticPaths() {
  return {
    paths: await getSubdomainPaths(),
    fallback: true, // fallback true allows sites to be generated using ISR
  }
}

export async function getStaticProps({ params: { site } }) {
  return {
    props: await getHostnameDataBySubdomain(site),
    revalidate: 3600, // set revalidate interval of 1 hour
  }
}
