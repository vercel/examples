import Fastify from 'fastify'

const app = Fastify({
  logger: true,
})

app.get('/', async (req, reply) => {
  return reply.status(200).type('text/html').send(html)
})

export default async function handler(req, reply) {
  await app.ready()
  app.server.emit('request', req, reply)
}

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"
    />
    <title>Vercel + Fastify Hello World</title>
    <meta
      name="description"
      content="This is a starter template for Vercel + Fastify."
    />
  </head>
  <body>
    <h1>Vercel + Fastify Hello World</h1>
    <p>
      This is a starter template for Vercel + Fastify. Requests are
      rewritten from <code>/*</code> to <code>/api/*</code>, which runs
      as a Vercel Function.
    </p>
    <p>
        For example, here is the boilerplate code for this route:
    </p>
    <pre>
<code>import Fastify from 'fastify'

const app = Fastify({
  logger: true,
})

app.get('/', async (req, res) => {
  return res.status(200).type('text/html').send(html)
})

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit('request', req, res)
}</code>
    </pre>
    <p>
    <p>
      <a href="https://vercel.com/templates/other/fastify-serverless-function">
      Deploy your own
      </a>
      to get started.
  </body>
</html>
`
