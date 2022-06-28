import { Page, Text, List, Link } from '@vercel/examples-ui'

export default function PageComponent({
  title,
  products,
}: {
  title: string
  products: Array<string>
}) {
  return (
    <Page>
      <Text variant="h2">{title}</Text>
      <List style={{ marginTop: 10 }}>
        {products.map((productInfo) => (
          <Text key={productInfo} variant="description">
            {productInfo}
          </Text>
        ))}
      </List>
      <section style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 'small' }}>
          <b>How it works:</b>
          <br />
          This example displays two variants of product pages to the users. Both
          pages use different sorting orders to display the list of products. It
          uses Optimizely feature flag in the Vercel Middleware to determine the
          sort order and to redirect users to correct pages. A unique visitor id
          is being generated, stored in the cookie and reused so that the
          decisions stick for the same browser session.
          <br />
          <br />
          This example uses Optimizely&nbsp;
          <Link
            href="https://docs.developers.optimizely.com/full-stack/v4.0/docs/javascript-node"
            target="_blank"
          >
            Javascript SDK
          </Link>{' '}
          inside Vercel Middleware to provide a starting point for you to
          implement experimentation and feature flagging for your experiences at
          the edge. For a guide to getting started with our platform more
          generally, this can be combined with the steps outlined in our
          Javascript Quickstart&nbsp;
          <Link
            href="https://docs.developers.optimizely.com/full-stack/v4.0/docs/javascript-node"
            target="_blank"
          >
            here
          </Link>
          .
          <br />
          <br />
          <b>Identity Management</b>
          <br />
          Out of the box, Optimizely&apos;s Full Stack SDKs require a
          user-provided identifier to be passed in at runtime to drive
          experiment and feature flag decisions. This example generates a unique
          id, stores it in a cookie and reuses it to make the decisions sticky.
          Another common approach would be to use an existing unique identifier
          available within your application.
          <br />
          <br />
          <b>Bucketing</b>
          <br />
          For more information on how Optimizely Full Stack SDKs bucket
          visitors, see&nbsp;
          <Link
            href="https://docs.developers.optimizely.com/full-stack/v4.0/docs/how-bucketing-works"
            target="_blank"
          >
            here
          </Link>
          .
        </Text>
      </section>
    </Page>
  )
}
