[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/framework-boilerplates/hono&template=hono)

Live Example: https://hono-ai-sdk-demo.vercel.app/

Prerequisites:

- [Vercel CLI](https://vercel.com/docs/cli) installed globally
- [AI Gateway](https://vercel.com/docs/ai-gateway#using-the-ai-gateway-with-an-api-key) key

To develop locally:

```
npm install
vc dev
```

```
open http://localhost:3000
```

To build locally:

```
npm install
vc build
```

To deploy:

```
npm install
vc deploy
```


### Usage

Pass a prompt via the `prompt` URL query parameter to get a streamed response:

- Browser:
  - `http://localhost:3000/?prompt=What%20is%20the%20capital%20of%20France?`

- cURL:

```bash
curl -G 'http://localhost:3000/' \
  --data-urlencode 'prompt=What is the capital of France?'
```

If `prompt` is omitted, the server falls back to a default prompt.
