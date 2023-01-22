import { useState } from 'react'
import { Layout, Page, Text, Button } from '@vercel/examples-ui'
import { Chat as ChatAPIRoute } from '../components/ChatAPI'
import { Chat as BrowserChat } from '../components/ChatBrowser'

function Home() {
  const [chatVersion, setChatVersion] = useState('api')

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">OpenAI GPT-3 text model usage example</Text>
        <Text className="text-zinc-600">
          In this example, a simple chat bot is implemented using Next.js, API
          Routes, and OpenAI API.
        </Text>
        <Text className="text-zinc-600">
          This example have two versions of the chat bot. The are differences in
          OpenAI API usage (API vs. browser), history context, and the prompt
        </Text>
        <ul>
          <li className="py-6">
            <strong>Simple - </strong> The Chat uses an API Route and the prompt
            is hidden behind the API call. This simple example sets the context
            history to 6 last messages. To limit API usage, the response is
            delayed.
          </li>

          <li>
            <strong>Advanced - </strong> This is the BYOK (Bring Your Own Key)
            version. OpenAI API is directly accessed through the browser in the
            Chat. The key is only stored in the browser, not on the Vercel
            server. OpenAI context history is set to the last 12 messages, and
            there is no artificial delay in response time.
          </li>
        </ul>
      </section>
      <section className="flex gap-4">
        <Button
          variant={chatVersion === 'api' ? 'primary' : 'secondary'}
          onClick={() => setChatVersion('api')}
        >
          Simple (API)
        </Button>{' '}
        <Button
          variant={chatVersion === 'browser' ? 'primary' : 'secondary'}
          onClick={() => setChatVersion('browser')}
        >
          Advanced (BYOK)
        </Button>
      </section>
      <section className="flex flex-col gap-3">
        <Text variant="h2">AI Chat Bot:</Text>
        <div className="lg:w-2/3">
          {chatVersion == 'api' ? <ChatAPIRoute /> : <BrowserChat />}
        </div>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
