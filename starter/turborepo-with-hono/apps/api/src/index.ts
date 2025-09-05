import { Hono } from 'hono'
import { CONSTANT } from '@repo/constants'

const app = new Hono()

app.get('/', (c) => {
  return c.text(CONSTANT)
})

export default app
