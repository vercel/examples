import type { FC, ReactNode } from 'react'

import { Code, Layout, Page, Text } from '@vercel/examples-ui'

const Snippet: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

const Console: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <pre className="bg-black text-white font-mono text-left py-2 px-4 rounded-lg text-sm leading-6">
      {children}
    </pre>
  )
}

function IndexPage() {
  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">Adding headers at the edge</Text>
        <Text>
          In some cases we might want to add or modify the headers from an
          incoming request for different reasons, AB testing, personalization,
          analytics, etc. To have access to the tenative response we can call{' '}
          <Code>NextResponse.next()</Code> and then modify its headers:
        </Text>
        <Snippet>
          {`// Store the response so we can modify its headers
const response = NextResponse.next()

// Set custom header
response.headers.set(
  "x-modified-edge",
  "true"
)

// Return response
return response`}
        </Snippet>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col items-center gap-3">
        <Text>
          Open the network tab in devtools to see the response headers
        </Text>
        <Console>
          <p>
            <strong>{'x-modified-edge: '}</strong>
            true
          </p>
        </Console>
      </section>
    </Page>
  )
}

IndexPage.Layout = Layout

export default IndexPage
