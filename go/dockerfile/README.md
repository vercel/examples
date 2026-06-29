# Go Dockerfile Starter

Deploy a Go HTTP server to Vercel using a `Dockerfile.vercel`, with zero configuration. Vercel builds the image, stores it, and runs it on [Fluid compute](https://vercel.com/blog/introducing-fluid-compute) — your server only needs to listen on `$PORT`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=Deploy%20a%20Go%20HTTP%20server%20to%20Vercel%20from%20a%20Dockerfile.&demo-title=Go%20Dockerfile%20Starter&demo-url=https%3A%2F%2Fvercel-plus-go-dockerfile.labs.vercel.dev%2F&from=templates&project-name=Go%20Dockerfile%20Starter&repository-name=go-dockerfile-starter&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fgo%2Fdockerfile&skippable-integrations=1)

_Live Example: https://vercel-plus-go-dockerfile.labs.vercel.dev/_

## How it works

This example ships a `Dockerfile.vercel`. On deploy, Vercel detects it, builds the container image, and runs it on Fluid compute. The only requirement is that your server listens on the port from `$PORT`.

The app uses only the Go standard library and exposes:

- `GET /` — a landing page that renders the live container info
- `GET /healthz` — health check
- `GET /api/info` — live container/runtime info (hostname, region, Go version, CPUs, uptime)
- `GET /api/echo` — echoes your request

It also shows a few production niceties: structured logging with `log/slog`, sensible `http.Server` timeouts, and graceful shutdown on `SIGTERM` (which Vercel sends when scaling an instance down).

## Running Locally

Make sure you have Go installed (from [go.dev](https://go.dev/dl/)).

Start the server on http://localhost:3000:

```bash
go run .
```

Run the tests:

```bash
go test ./...
```

Or build and run the container exactly as Vercel does:

```bash
docker build -f Dockerfile.vercel -t go-dockerfile .
docker run --rm -e PORT=3000 -p 3000:3000 go-dockerfile
```

## Deploying to Vercel

Deploy your project to Vercel with the following command:

```bash
npm install -g vercel
vercel --prod
```

Or `git push` to your repository with our [git integration](https://vercel.com/docs/deployments/git).

To view the source code for this example, [visit the example repository](https://github.com/vercel/examples/tree/main/go/dockerfile).
