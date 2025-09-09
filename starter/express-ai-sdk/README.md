# Express.js + AI SDK Example

You can use the AI SDK in an [Express.js](https://expressjs.com/) server to generate and stream text and objects using Vercel's AI Gateway.

## Usage

1. Create .env file to use Vercel AI Gateway:

```sh
AI_GATEWAY_API_KEY=your_ai_gateway_api_key
```

2. Run the following commands from the root directory of the AI SDK repo:

```sh
pnpm install
pnpm build
```

3. Run the following command:

```sh
pnpm dev
```

4. Test the endpoint with Curl:

```sh
curl -X POST http://localhost:8080
curl -X POST http://localhost:8080/custom-data-parts
```
