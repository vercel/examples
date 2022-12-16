import { Layout, Text, Page } from '@vercel/examples-ui'
import { Chat } from '../components/Chat'

function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">OpenAI GPT-3 text model usage example</Text>
        <Text className="text-zinc-600">
          In this example, a simple chat bot is implemented using Next.js, API
          Routes, and OpenAI API.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">AI Chat Bot:</Text>
        <div className="lg:w-2/3">
          <Chat />
        </div>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
