# Development Policy

## Build

- Build with `pnpm build` (Next.js production build)
- Requires Node.js 24.x and pnpm 10.29.2
- Install dependencies with `pnpm install`

## Testing

- Run unit tests with `pnpm test` (vitest)
- Tests mock the GLIDE client — no running Valkey instance required for unit tests
- Manual integration testing requires a local Valkey instance: `docker run -d -p 6379:6379 valkey/valkey:latest`

## Code style

- ESLint with `next/core-web-vitals` config
- TypeScript with strict mode disabled (Next.js template default)
- API errors return generic messages to the client — never leak internal details (hostnames, stack traces)

## Dependencies

- **Valkey client**: Always use `@valkey/valkey-glide`. Never use `ioredis`, `redis`, or any other Redis/Valkey client library. The fundamental purpose of this project is to showcase Valkey GLIDE.
- Do not add dependencies without justification. This is a minimal reference template — additional complexity reduces its value as a learning example.

## Architecture rules

- Single API route (`/api/messages`) with POST/GET/DELETE methods. Do not split into separate route files.
- No authentication in this demo. The README warns about this; do not add auth middleware unless the project scope changes.
- GLIDE client is a module-level singleton reused across warm invocations. Do not create a new client per request.
- Runtime must be `'nodejs'` (native module requirement for GLIDE). Do not use Edge runtime.

## Prohibited actions

- Do not use any Redis client library (ioredis, redis, etc.) — always GLIDE
- Do not add authentication middleware (out of scope for this demo)
- Do not shell out to `valkey-cli` or `redis-cli` from application code

## Environment

- `VALKEY_ENDPOINT` — Required. Format: `host:port`. Local dev default: `localhost:6379`
- Create `.env.local` for local development (not committed to git)

