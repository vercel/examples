import Koa from 'koa'
import { Router } from '@koa/router'

const app = new Koa()
const router = new Router()

// Define routes using the router instance
router.get('/', (ctx) => {
  ctx.body = { message: 'Hello from Koa!' }
})

router.get('/api/users/:id', (ctx) => {
  ctx.body = { userId: ctx.params.id }
})

router.post('/api/data', async (ctx) => {
  // Access request body via ctx.request.body (requires body parser middleware)
  ctx.body = { status: 'success' }
})

// Apply router middleware to the app
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
