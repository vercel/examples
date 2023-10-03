import { Page, Text, Link, Code, Snippet } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Sharing State in Next.js</Text>
        <Text>
          Sharing state between pages or layouts in a Next.js may be complex
          when pages fetch data from the server or you need to track state on a
          layout for tasks like user interactions within nested routes.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2">Client layouts and server pages</Text>
        <Text>
          Although client components can&apos;t include server components, we
          can have a client layout rendering a page from the server. This allows
          us to create a state or context to share data across our application.
        </Text>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2">Getting Started</Text>
        <Text>
          We&apos;ll create a root layout for our app that will show the counter
          state, a providers file with our counter context, and a page and
          nested page that both render a counter client component to mutate the
          counter state.
        </Text>
        <pre className="border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6">{`|/app
|__/layout.js (client) - this is the root layout which displays the counter state
|__/providers.js (client) - exports the counter context
|__/counter.js (client) - a component that updates the counter
|__/page.js (server) - renders the counter component
|__/nested
|____/page.js (server) - renders the counter component on a nested page
`}</pre>
        <Text>
          We start by creating a context that stores a <Code>counter</Code>{' '}
          value and exports a <Code>useCounter</Code> hook to interact with that
          value:
        </Text>
        <Snippet>
          {`// app/providers.js
import { createContext, useContext, useState } from 'react'

const Counter = createContext([0, () => {}])

function CounterProvider({ children }) {
  const state = useState(0)
  return <Counter.Provider value={state}>{children}</Counter.Provider>
}

const useCounter = () => useContext(Counter)

export { CounterProvider, useCounter }
`}
        </Snippet>
        <Text>
          Now, lets wrap our root layout with this context provider to make the{' '}
          <Code>useCounter</Code> hook available to its pages:
        </Text>
        <Snippet>
          {`// app/layout.js
'use client'

import { Link } from 'next/link'
import { CounterProvider, useCounter } from './providers'

function RootLayout({ children }) {
  const [counter] = useCounter()

  return (
    <>
      <nav>
        <Link href="/">Index</Link>
        <Link href="/nested">Nested</Link>
      </nav>
      {children}
      <hr />
      <h2>Counter</h2>
      <p>{counter}</p>
    </>
  )
}

export default function RootLayoutContainer(props) {
  return (
    <CounterProvider>
      <RootLayout {...props} />
    </CounterProvider>
  )
}`}
        </Snippet>
        <Text>
          Next, let&apos;s create a counter component that will allow us to
          increment and decrement the counter value.
        </Text>
        <Snippet>
          {`// app/counter.js
'use client'

import { useCounter } from './providers'

export default function Counter() {
  const [counter, setCounter] = useCounter()

  return (
    <div>
      <button onClick={() => setCounter((counter) => counter - 1)}>
        Decrement
      </button>
      <p>{counter}</p>
      <button onClick={() => setCounter((counter) => counter + 1)}>
        Increment
      </button>
    </div>
  )
}`}
        </Snippet>
        <Text>
          And finally we will create a page and a nested page where both render
          the counter component:
        </Text>
        <Snippet>
          {`// app/page.js
import Counter from './counter'

export default function IndexPage() {
  return (
    <div>
      <h1>Index page</h1>
      <Counter />
    </div>
  )
}`}
        </Snippet>
        <Snippet>
          {`// app/nested/page.js
import Counter from './counter'

export default function NestedPage() {
  return (
    <div>
      <h1>Nested page</h1>
      <Counter />
    </div>
  )
}`}
        </Snippet>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="h2">Fetching data from the layout</Text>
        <Text>
          If you need your layout to fetch information from the server, you can
          create a group and make the layout inside the group a client component
          instead of the root layout
        </Text>
        <pre className="border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6">{`|/app
|__/layout.js (server)
|__/(app)
|____/layout.js (client)
|____/page.js (server)
|____/providers.js (client)
|____/counter.js (client)
|____/nested
|______/page.js (server)
`}</pre>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Demo</Text>
        <Text>
          Now you will be able to fetch information from the server while
          sharing state between layouts and routes,{' '}
          <Link href="/demo">click here to see a working demo</Link>.
        </Text>
      </section>
    </Page>
  )
}
