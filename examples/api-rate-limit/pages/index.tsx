import { Page, Headers } from '@components'

export default function Index() {
  return (
    <Page>
      <h1>API Rate Limiting with Upstash</h1>
      <p>
        By using Redis with Upstash we can keep a counter of requests by IP at
        the edge.
      </p>
      <p>
        For the demo below you can send a maximum of{' '}
        <b>5 requests every 10 seconds</b>.
      </p>
      <Headers path="/api">Make a request with Edge Caching</Headers>
      <p>
        The pattern we're using in this example is inspired by the{' '}
        <a
          href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github API
        </a>
        .
      </p>
    </Page>
  )
}
