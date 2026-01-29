import { Layout, Text, Link } from '@vercel/examples-ui'

function Explanation() {
  return (
    <>
      <Text variant="h2">How this example works</Text>
      <Text>
        This example shows two variants of pages. First one is the default home
        page and the other one is new home page. It uses Kameleoon feature flag
        in the Vercel Middleware to redirect user to correct pages. A unique
        visitor id is being generated, stored in the cookie and reused so that
        the decisions stick for the same browser session.
        <br />
        <br />
        This example uses&nbsp;
        <Link
          href="https://developers.kameleoon.com/feature-management-and-experimentation/web-sdks/nodejs-sdk"
          target="_blank"
        >
          Kameleoon NodeJS SDK
        </Link>
        &nbsp; inside Vercel Middleware to provide a starting point for you to
        implement experimentation and feature flagging for your experiences at
        the edge. For more information on how to run Feature Flags and
        Experiments with our platform follow the steps outlined in our
        documentation
        <Link
          href="https://developers.kameleoon.com/feature-management-and-experimentation/web-sdks/nodejs-sdk"
          target="_blank"
        >
          &nbsp; here
        </Link>
        .
      </Text>
    </>
  )
}

Explanation.Layout = Layout

export default Explanation
