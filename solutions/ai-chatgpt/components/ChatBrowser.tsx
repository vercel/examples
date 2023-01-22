import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

import { type Message, ChatLine, LoadingChatLine } from './ChatLine'
import { InputMessage } from './InputMessage'
import InputKey from './InputKey'
import { generatePromptFromMessages } from '../lib/generatePromptFromMessages'

const COOKIE_NAME = 'nextjs-example-ai-chat-gpt3-user'
const COOKIE_KEY = 'nextjs-example-ai-chat-gpt3-key'

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: Message[] = [
  {
    who: 'bot',
    message: 'Hi! I’m A friendly AI assistant. Ask me anything!',
  },
]

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [cookie, setCookie] = useCookies([COOKIE_NAME, COOKIE_KEY])

  const [botName, setBotName] = useState('AI')
  const [userName, setUserName] = useState('News reporter')
  const [keyOpenAI, setKeyOpenAI] = useState('sk-XXXX') // default OpenAI key
  const [prompt, setPrompt] = useState(
    `I am Friendly AI Assistant. \n\nThis is the conversation between AI Bot and a news reporter.\n\n${botName}: ${initialMessages[0].message}\n${userName}: `
  )

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }
    // override the default key if it's set in the cookie
    if (cookie[COOKIE_KEY]) {
      setKeyOpenAI(cookie[COOKIE_KEY])
    }
  }, [cookie, setCookie])

  const sendMessage = async (message: string) => {
    setLoading(true)
    const newMessages = [
      ...messages,
      { message: message, who: 'user' } as Message,
    ]
    setMessages(newMessages)
    const last10messages = newMessages.slice(-12) // remember last 12 messages

    // const messages = req.body.messages
    const messagesPrompt = generatePromptFromMessages(
      last10messages,
      userName,
      botName
    )
    const finalPrompt = `${prompt}${messagesPrompt}\n${botName}: `

    const payload = {
      model: 'text-davinci-003',
      prompt: finalPrompt,
      temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
      max_tokens: process.env.AI_MAX_TOKENS
        ? parseInt(process.env.AI_MAX_TOKENS)
        : 200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: [`${botName}:`, `${userName}:`],
      user: cookie[COOKIE_NAME],
    }

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${keyOpenAI}`,
    }

    // use OpenAI API directly in browser to generate a response
    const response = await fetch('https://api.openai.com/v1/completions', {
      headers: requestHeaders,
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    // strip out white spaces from the bot message
    let botNewMessage = ''

    if (data.error) {
      console.error('OpenAI API error: ', data.error)
      botNewMessage = `ERROR with API integration. ${data.error.message}`
    } else {
      console.log(' == DATA = ', data)
      botNewMessage = data.choices[0].text.trim()
    }

    setMessages([
      ...newMessages,
      { message: botNewMessage, who: 'bot' } as Message,
    ])
    setLoading(false)
  }

  return (
    <>
      <InputKey
        input={keyOpenAI}
        setInput={(key: string) => {
          setKeyOpenAI(key)
          setCookie(COOKIE_KEY, key)
        }}
      />
      <div className="rounded-2xl border-zinc-100  lg:border lg:p-6">
        {messages.map(({ message, who }, index) => (
          <ChatLine key={index} who={who} message={message} />
        ))}

        {loading && <LoadingChatLine />}

        {messages.length < 2 && (
          <span className="mx-auto flex flex-grow text-gray-600 clear-both">
            Type a message to start the conversation
          </span>
        )}
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </>
  )
}
