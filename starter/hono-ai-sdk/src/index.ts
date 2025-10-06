import { Hono } from 'hono'
import { streamText } from 'ai'
import { stream } from 'hono/streaming'

const app = new Hono()

const defaultPrompt = 'Why is the sky blue?'

app.get('/', async (c) => {
  const prompt = c.req.query('prompt') ?? defaultPrompt
  const result = streamText({
    model: 'xai/grok-3',
    prompt,
  })

  return stream(c, async (stream) => {
    const prependStream = `Prompt: ${prompt}\n\n`
    await stream.write(prependStream)
    for await (const textPart of result.textStream) {
      await stream.write(textPart)
    }
  })
})

export default app
