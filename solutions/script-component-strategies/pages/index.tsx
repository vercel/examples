import { Layout, Text, Page, Code, Link, List } from '@vercel/examples-ui'
import Snippet from '../components/Snippet'

function Home() {
  return (
    <Page>
      <section className="flex flex-col gap-6">
        <Text variant="h1">next/script strategies</Text>
        <Text>
          The Next.js Script component,{' '}
          <Link href="https://nextjs.org/docs/api-reference/next/script">
            next/script
          </Link>
          , is an extension of the HTML <Code>{`<script>`}</Code> element. It
          enables developers to set the loading priority of third-party scripts
          anywhere in their application without needing to append directly to
          next/head, saving developer time while improving loading performance.
        </Text>
        <Text>
          With next/script, you decide when to load your third-party script by
          using the strategy property:
        </Text>
        <Snippet>
          {`<Script src="https://connect.facebook.net/en_US/sdk.js" strategy="lazyOnload" />`}
        </Snippet>
        <Text>
          There are three different loading strategies that can be used:
        </Text>
        <List>
          <li>
            <Code>
              <a href="#beforeInteractive">beforeInteractive</a>
            </Code>{' '}
            : Load before the page is interactive.
          </li>
          <li>
            <Code>
              <a href="#afterInteractive">afterInteractive</a>
            </Code>{' '}
            (default) : Load immediately after the page becomes interactive.
          </li>
          <li>
            <Code>
              <a href="#lazyOnload">lazyOnload</a>
            </Code>{' '}
            : Load during idle time.
          </li>
        </List>
        <Text>
          To see how to implement the script component reffer to its{' '}
          <Link href="https://nextjs.org/docs/api-reference/next/script">
            documentation
          </Link>{' '}
          or if you want to know more information on how to handle scripts, look{' '}
          <Link href="https://nextjs.org/docs/basic-features/script">here</Link>
          .
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section id="beforeInteractive" className="flex flex-col gap-3">
        <Text variant="h2">beforeInteractive examples</Text>
        <List>
          <li>
            Polyfill: <Link href="/polyfill">Demo</Link> -{' '}
            <Link href="https://github.com/vercel/examples/blob/main/solutions/script-component-strategies/pages/polyfill.tsx">
              Code
            </Link>
          </li>
        </List>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section id="afterInteractive" className="flex flex-col gap-3">
        <Text variant="h2">afterInteractive examples</Text>
        <List>
          <li>
            Stripe sdk: <Link href="/stripe">Demo</Link> -{' '}
            <Link href="https://github.com/vercel/examples/blob/main/solutions/script-component-strategies/pages/stripe.tsx">
              Code
            </Link>
          </li>
        </List>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section id="lazyOnLoad" className="flex flex-col gap-3">
        <Text variant="h2">lazyOnLoad examples</Text>
        <List>
          <li>
            FB sdk: <Link href="/fb">Demo</Link> -{' '}
            <Link href="https://github.com/vercel/examples/blob/main/solutions/script-component-strategies/pages/fb.tsx">
              Code
            </Link>
          </li>
        </List>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
