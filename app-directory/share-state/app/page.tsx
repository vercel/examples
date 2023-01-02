import { Page, Text, Link, Code, Snippet } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Share state within app dir</Text>
        <Text>
          Sometimes you need to share state between pages or layouts within your
          app. It may be complex as your pages fetch data from the server or you
          need to track state on your layout from user interactions within
          nested routes.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Client layouts and server pages</Text>
        <Text>
          Althought client components can&apos;t include server components, we
          can have a client layout rendering a page from the server. This allows
          us to create a state or context to share data across our application.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Creating the files</Text>
        <Text>
          We will create a root layout for our app that will show the counter
          state, a context to share state, an index and a nested page that
          displays the counter component and a counter client component to
          interact with our state.
        </Text>
        <pre className="border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6">{`|/app
|__/layout.js (client)
|__/context.js (client)
|__/counter.js (client)
|__/page.js (server)
|__/nested
|____/page.js (server)
`}</pre>
        <Text>
          Lets create a simple context that stores a <Code>counter</Code> value
          and exports a <Code>useCounter</Code> hook to interact with that
          value.
        </Text>
        <Snippet>
          {`// app/context.js
import { createContext, useContext, useState } from "react";

const CounterContext = createContext({});

function CounterProvider({ children }) {
  const state = useState(0);

  return <CounterContext.Provider value={state}>{children}</CounterContext.Provider>;
}

function useCounter() {
  return useContext(CounterContext);
}

export { CounterProvider, useCounter };`}
        </Snippet>
        <Text>
          Now, lets wrap our root layout with this context provider. This will
          make the <Code>useCounter</Code> hook available to all the pages
          inside this layout.
        </Text>
        <Snippet>
          {`// app/layout.js
"use client";

import { Link } from "next/link";
import { CounterProvider, useCounter } from "./context";

function RootLayout({ children }) {
  const [counter] = useCounter();

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
  );
}

export default function RootLayoutContainer(props) {
  return (
    <CounterProvider>
      <RootLayout {...props} />
    </CounterProvider>
  );
}`}
        </Snippet>
        <Text>
          Now, lets create a counter component that will allow us to increment
          and decrement the counter value.
        </Text>
        <Snippet>
          {`// app/counter.js
"use client";

import { useCounter } from "./context";

export default function Counter() {
  const [counter, setCounter] = useCounter();

  return (
    <div>
      <button onClick={() => setCounter((counter) => counter - 1)}>Decrement</button>
      <p>{counter}</p>
      <button onClick={() => setCounter((counter) => counter + 1)}>Increment</button>
    </div>
  );
}`}
        </Snippet>
        <Text>
          And finally we will create an index and a nested page with the same
          content that will render the counter component.
        </Text>
        <Snippet>
          {`import Counter from "./counter"; 

export default function IndexPage() {
  return (
    <div>
      <h1>Index page</h1>
      <Counter />
    </div>
  );
}`}
        </Snippet>
        <Snippet>
          {`import Counter from "../counter"; 

export default function NestedPage() {
  return (
    <div>
      <h1>Nested page</h1>
      <Counter />
    </div>
  );
}`}
        </Snippet>
      </section>

      <section className="flex flex-col gap-3">
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
|____/context.js (client)
|____/counter.js (client)
|____/nested
|______/page.js (server)
`}</pre>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Demo</Text>
        <Text>
          Now you will be able to fetch information from the server while
          sharing state between layouts and routes, you can see a working demo
          in <Link href="/demo">here</Link>.
        </Text>
      </section>
    </Page>
  )
}
