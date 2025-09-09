import {
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  streamText,
} from 'ai'
import 'dotenv/config'
import express, { Request, Response } from 'express'

const app = express()

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
