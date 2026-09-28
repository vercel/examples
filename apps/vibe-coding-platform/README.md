# Vibe Coding Platform

An end-to-end coding platform powered by [eve](https://eve.dev/), with durable conversations, persistent project files, a live preview, a file explorer, and command logs.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=A+full-stack+coding+platform+built+with+Vercel%27s+AI+Cloud%2C+AI+SDK%2C+and+Next.js.&demo-image=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fv1754588832%2FOSSvibecodingplatform%2Fscreenshot.png&demo-title=Vibe+Coding+Platform&demo-url=https%3A%2F%2Fvercel.fyi%2Fvibes&project-name=Vibe+Coding+Platform&repository-name=vibe-coding-platform&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fapps%2Fvibe-coding-platform&from=vibe-coding-platform-app)

## Features

- Multi-model support via AI Gateway (Claude, GPT, Grok)
- Durable agent execution and reconnectable streams with eve
- Isolated code execution with Vercel Sandbox managed images
- Project files and dependencies persisted on Sandbox drives
- Real-time live preview of generated apps
- File explorer for browsing project files
- Command logs and error monitoring
- One-click deploy to Vercel

## Tech Stack

- [Next.js](https://nextjs.org) with Turbopack
- [eve](https://eve.dev/docs) for agent orchestration and the React client
- [AI SDK](https://ai-sdk.dev) v7 for model providers and error classification
- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [Vercel Sandbox](https://vercel.com/docs/sandbox) v3 with managed images and drives
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## Getting Started

### Run Locally

Use **Node.js 24**. Link a Vercel project with Sandbox and AI Gateway access, then pull development credentials:

```bash
pnpm install
vercel link
vercel env pull .env.local
```

Set `PROJECT_SECRET` in `.env.local` to a random secret of at least 32 characters (for example, generate one with `openssl rand -hex 32`). Keep it stable across restarts and deployments so existing project credentials continue to work.

| Variable                          | Purpose                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `PROJECT_SECRET`                  | Required server-only signing secret for project access.                                                                              |
| `VERCEL_OIDC_TOKEN`               | Local Sandbox and AI Gateway credentials from `vercel env pull`; refresh when expired. Vercel deployments supply OIDC automatically. |
| `AI_GATEWAY_API_KEY`              | Optional alternative to OIDC for model access.                                                                                       |
| `SANDBOX_REGION`                  | Sandbox and drive region, default `iad1`. Keep it stable for existing projects.                                                      |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | Required for the server-to-server session creation request when the deployment uses Vercel Deployment Protection.                    |

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). `withEve()` starts the agent service alongside Next.js. The `just-bash` development dependency supports eve's bundled local development extension; it is not the environment used for generated applications.

## Project Lifecycle

Each project has one durable eve session, one named persistent sandbox, and one drive mounted at `/workspace`. The sandbox uses `vercel/sandbox/node:24`; generated source and dependencies live on the drive. Only one sandbox may mount that drive read-write, and the sandbox and drive must use the same region.

Reloading the page replays the current session's messages and tool outputs. Closing the browser does not cancel an active turn. The stop button cancels the turn; the new-project button creates a separate session and workspace.

Compute pauses after ten minutes. **Resume workspace** restores compute and restarts the preview using its saved launch command. A drive preserves files, not running processes. Status polling does not resume paused compute.

Command logs are streamed from Sandbox, not archived on the drive. Logs from older compute instances may no longer be available after resuming; new preview processes appear as separate commands.

The custom provider in `agent/lib/project-sandbox.ts` connects eve's sandbox lifecycle to the native Sandbox APIs needed for preview URLs and command logs. Authored tools access it through `ctx.getSandbox(environment)`.

This demo stores only the current project's session ID and signed credential in browser local storage. The credential permits access to that session and workspace for 30 days. It is not an account system or a multi-project database. New projects do not delete old storage: use the Vercel Sandbox dashboard or CLI to delete unused sandboxes and drives. Drives persist and incur storage charges until deleted.

`/api/projects` checks BotID before creating a session and issuing its credential. eve routes and file/log/resume endpoints verify that credential and its session scope. Do not expose `PROJECT_SECRET` to the browser or generated sandbox.

## Verification

```bash
pnpm test
pnpm type-check
pnpm build:agent
pnpm build
```

With Sandbox credentials loaded, `pnpm test:sandbox` creates an isolated test drive and sandbox, starts an HTTP preview, stops and resumes compute, verifies the file and preview survive, then deletes its test resources. This check uses billable Sandbox resources.

For a local production run, build both services as above, then run `pnpm start`. The Vercel integration builds and routes the eve service automatically when deployed.

## Supported Models

- Claude Opus 4.6
- Claude Sonnet 4.6
- GPT-5.3 Codex
- Grok 4.1 Reasoning

## Deploy

Configure `PROJECT_SECRET` in the project's deployment environment before deploying. Keep the same value on the Next.js and generated eve services. Then use the deploy button above or run:

```bash
vc deploy
```
