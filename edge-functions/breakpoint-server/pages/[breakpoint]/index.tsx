import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import type { ParsedUrlQuery } from 'querystring'
import { Layout } from '@vercel/examples-ui'
import { Breakpoint, BreakpointServer, serverBreakpoints } from '../../config/breakpoints'
import { useBreakpoint } from '../../hooks/use-breakpoint/use-breakpoint'

interface Params extends ParsedUrlQuery {
  breakpoint: BreakpointServer
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = serverBreakpoints.map((breakpoint) => ({
    params: { breakpoint },
  }))

  return {
    paths: paths,
    fallback: true, // fallback true allows sites to be generated using ISR
  }
}

export const getStaticProps: GetStaticProps<unknown, Params> = async ({
  params: { breakpoint },
}) => {
  return {
    props: {
      breakpoint,
    },
    revalidate: 60,
  }
}

export default function HomePage() {
  const size = useBreakpoint()
  const isSmall = size === Breakpoint.xs || size === Breakpoint.sm

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <Head>
        <title>Breakpoint-server – Vercel Edge Functions</title>
      </Head>

      {isSmall ? <>SMALL COMPONENT</> : <>LARGE COMPONENT</>}
    </div>
  )
}

HomePage.Layout = Layout
