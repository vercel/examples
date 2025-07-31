import { Hono } from 'hono'
import { streamText } from 'ai'
import { stream } from 'hono/streaming'

const app = new Hono()

app.get('/', async (c) => {
  const result = streamText({
    model: 'xai/grok-3',
    prompt: 'Why is the sky blue?',
  })

  return stream(c, async (stream) => {
    for await (const textPart of result.textStream) {
      await stream.write(textPart)
    }
  })
})

export default app
