import Fastify from 'fastify'

export const app = Fastify({
  logger: true,
})

app.get('/', async (_, reply) => {
  return reply.status(200).type('text/html').send(html)
})

app.get('/hello', async (req, reply) => {
  const hasName = (query: unknown): query is { name: string } => {
    return (
      typeof query === 'object' &&
      query !== null &&
      'name' in query &&
      typeof query.name === 'string'
    )
  }

  const name = hasName(req.query) ? req.query.name : 'World!'

  return reply.status(200).type('text/html').send(`Hello, ${name}!`)
})

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
    <title>Vercel + Fastify + Typescript with Tsup Hello World</title>
    <meta
      name="description"
      content="This is a starter template for Vercel + Fastify + Typescript with Tsup."
    />
  </head>
  <body>
    <h1>Vercel + Fastify + Typescript with Tsup Hello World</h1>
    <p>
      This is a starter template for Vercel + Fastify + Typescript using Tsup to build it. Requests are
      rewritten from <code>/*</code> to <code>/src/serverless.ts</code>, which runs
      as a Vercel Function after being built to <code>./dist/serverless.js</code>.
    </p>
  </body>
</html>
`
