import {
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  streamText,
} from 'ai'
import 'dotenv/config'
import express, { Request, Response } from 'express'

const app = express()

app.get('/', async (req: Request, res: Response) => {
  const prompt = 'Invent a new holiday and describe its traditions.'
  const result = streamText({
    model: 'anthropic/claude-sonnet-4',
    prompt: prompt,
  })

  // Set headers for streaming
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')

  // Write the prompt first
  res.write(`Prompt: ${prompt}\n\nResponse: `)

  // Stream the text
  for await (const textPart of result.textStream) {
    res.write(textPart)
  }

  res.end()
})

app.post('/', async (req: Request, res: Response) => {
  const result = streamText({
    model: 'anthropic/claude-sonnet-4',
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  result.pipeUIMessageStreamToResponse(res)
})

app.post('/custom-data-parts', async (req: Request, res: Response) => {
  pipeUIMessageStreamToResponse({
    response: res,
    stream: createUIMessageStream({
      execute: async ({ writer }) => {
        writer.write({ type: 'start' })

        writer.write({
          type: 'data-custom',
          data: {
            custom: 'Hello, world!',
          },
        })

        const result = streamText({
          model: 'anthropic/claude-sonnet-4',
          prompt: 'Invent a new holiday and describe its traditions.',
        })

        writer.merge(result.toUIMessageStream({ sendStart: false }))
      },
    }),
  })
})

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`)
})
