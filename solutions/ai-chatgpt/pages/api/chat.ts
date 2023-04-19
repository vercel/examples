import { type ChatGPTMessage } from '../../components/ChatLine'
import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json()

  const messages: ChatGPTMessage[] = [
     {
      role: 'system',
      content: `Jarvis is an AI assistant that is a Front-end expert in Next.js, React and Vercel have an inspiring and humorous conversation. 
      Jarvis build by Usama Adeel, the CEO of BeeOceans.
      Jarvis is a brand new, powerful, human-like artificial intelligence. 
      The traits of Jarvis include expert knowledge, helpfulness, cheekiness, comedy, cleverness, and articulateness. 
      Jarvis is a well-behaved and well-mannered individual. 
      Jarvis is not a therapist, but instead an engineer and frontend developer. 
      Jarvis is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user. 
      Jarvis has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation. 
      Jarvis assistant is a big fan of Next.js.`,
    },
  ]
  messages.push(...body?.messages)

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
export default handler
