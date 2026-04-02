# Go Starter

Deploy your Go project to Vercel with zero configuration. Uses only the standard library (`net/http`).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=Deploy%20Go%20applications%20with%20zero%20configuration%20using%20only%20the%20standard%20library.&demo-title=Go%20Boilerplate&demo-url=https%3A%2F%2Fvercel-plus-go.labs.vercel.dev%2F&from=templates&project-name=Go%20Boilerplate&repository-name=go-boilerplate&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fvercel%2Ftree%2Fmain%2Fexamples%2Fgo-api&skippable-integrations=1)

_Live Example: https://vercel-plus-go.labs.vercel.dev/_

Visit the [Go documentation](https://pkg.go.dev/net/http) to learn more.

## Getting Started

Make sure you have Go installed. If not, install it from [go.dev](https://go.dev/dl/).

Build the project:

```bash
go build ./cmd/server
```

## Running Locally

Start the development server on http://localhost:3000

```bash
go run ./cmd/server
```

When you make changes to your project, restart the server to see your changes.

## Deploying to Vercel

Deploy your project to Vercel with the following command:

```bash
npm install -g vercel
vercel --prod
```

Or `git push` to your repository with our [git integration](https://vercel.com/docs/deployments/git).

To view the source code for this template, [visit the example repository](https://github.com/vercel/vercel/tree/main/examples/go-api).
