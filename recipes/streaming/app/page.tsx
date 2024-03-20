import { Page, Text, Code, Link } from '@vercel/examples-ui'

export default function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Streaming Examples</Text>
      </section>

      <section className="flex flex-col gap-3">
        <Link href="/chat">
          <Text variant="h2">Streaming responses from LLMs and AI APIs</Text>
        </Link>
        <Text>A simple AI-chatbot with a streaming user interface.</Text>
      </section>
      <section className="flex flex-col gap-3">
        <Link href="/api/data-chunk">
          <Text variant="h2">Processing data chunks</Text>
        </Link>
        <Text>
          An API endpoint that processes data chunks, transforms them and send
          them as a stream of chunks.
        </Text>
      </section>
      <section className="flex flex-col gap-3">
        <Link href="/api/backpressure">
          <Text variant="h2">Handling backpressure</Text>
        </Link>
        <Text>
          An API endpoint that handles the client not being able to process the
          streamed data as fast as the server is sending them.
        </Text>
      </section>
    </Page>
  )
}
