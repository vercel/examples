import type { FC, ReactNode } from 'react'

import { Code, Layout, Link, Page, Snippet, Text } from '@vercel/examples-ui'

const Console: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <pre className="bg-black text-white font-mono text-left py-2 px-4 rounded-lg text-sm leading-6">
      {children}
    </pre>
  )
}

export function getServerSideProps(ctx: any) {
  return {
    props: {
      requestHeaders: ctx.req.headers,
    },
  }
}

function IndexPage({ requestHeaders }: any) {
  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Modyfing request headers in middleware</Text>
        <Text>
          In some cases we might want to add, modify, or delete request headers
          from clients to change behavior or pass data to API Routes or{' '}
          <Code>getServerSideProps</Code>. To modify to the request headers
          specify the new headers (see{' '}
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Headers">
            Headers API
          </Link>
          ) in <Code>request.headers</Code> parameter of{' '}
          <Code>NextResponse.next()</Code> or{' '}
          <Code>NextResponse.rewrite()</Code>.
        </Text>
        <Text>Only available since Next.js v13.0.0.</Text>
        <Snippet>
          {`// You can use headers API:
// https://developer.mozilla.org/en-US/docs/Web/API/Headers 
const requestHeaders = new Headers(request.headers)
requestHeaders.set('x-hello-from-middleware1', 'hello')
requestHeaders.set('x-hello-from-middleware2', 'world!')
requestHeaders.set('user-agent', 'New User Agent overriden by middleware!')

const response = NextResponse.next({
  request: {
    headers: requestHeaders,
  },
})
`}
        </Snippet>
      </section>

      <hr className="border-t border-accents-2 my-6" />
      <section className="flex flex-col items-center gap-3">
        <Text>
          Request Headers in <Code>getServerSideProps</Code>:
        </Text>
        <Console>
          <p>
            <strong>{'x-hello-from-middleware1: '}</strong>
            {requestHeaders['x-hello-from-middleware1']}
          </p>
          <p>
            <strong>{'x-hello-from-middleware2: '}</strong>
            {requestHeaders['x-hello-from-middleware2']}
          </p>
          <p>
            <strong>{'user-agent: '}</strong>
            {requestHeaders['user-agent']}
          </p>
        </Console>
      </section>
    </Page>
  )
}

IndexPage.Layout = Layout

export default IndexPage
