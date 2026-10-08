// Returns a required env var or throws a clear error. Keep `process.env.X` a
// literal at the call site so Next.js can inline `NEXT_PUBLIC_*` into the bundle.
export function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}". Copy .env.example to .env.local and set it (or configure it in your Vercel project).`
    )
  }
  return value
}
