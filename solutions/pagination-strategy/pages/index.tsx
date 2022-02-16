import Head from 'next/head'
import { Layout, Text, Page, Code, Link } from '@vercel/examples-ui'

function Home() {
  return (
    <Page>
      <Head>
        <title>Pagination Strategy - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use Pagination Strategy"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">Pagination Strategy usage example</Text>
        <Text>
          This example shows how to Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Voluptas eligendi aliquam officiis aliquid neque
          consequuntur ipsam iste, id, minima sit nulla quidem numquam, vitae
          hic quae sapiente nostrum vel ut.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">Header</Text>
        <Text>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error quasi{' '}
          <code>dolorum natus</code>, quaerat voluptatum laboriosam minima quis
          consectetur quam architecto veniam! Ex atque rem, unde tempora eaque
          quasi mollitia tenetur.
        </Text>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
