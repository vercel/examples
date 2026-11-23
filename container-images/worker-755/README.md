---
name: Worker 755 on Vercel
slug: worker-755
description: Run Worker 755, an open-source browser game where an AI agent manages you as its subagent, on Vercel Functions as a container image with AI Gateway.
framework:
  - Other
type:
  - Starter
  - AI
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/worker-755
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/worker-755&project-name=worker-755&repository-name=worker-755&env=AI_GATEWAY_API_KEY&envDescription=Optional.%20An%20AI%20Gateway%20key%20for%20free%20shifts%20on%20the%20server%27s%20key.
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# Worker 755 on Vercel

Run [Worker 755](https://github.com/gulivan/worker755), an open-source (MIT) browser game where your manager is an AI agent that believes you are its subagent, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/runtimes/container). The manager is a real LLM with a task queue and tools; its instructions land in your in-browser terminal with a 90-second clock, and it checks your work, files incident reports and writes your performance review.

The game already talks to models through the [AI SDK](https://ai-sdk.dev) and [Vercel AI Gateway](https://vercel.com/docs/ai-gateway), so players can bring an AI Gateway or OpenRouter key, and the server can offer free shifts on its own AI Gateway key.

This example contains no game code. `Dockerfile.vercel` fetches Worker 755 at a pinned commit, builds its web app (the terminal runs in the browser, in a Web Worker), and runs the Node.js server, which streams game events to the browser with server-sent events.

> Worker 755 has no tagged releases. This example pins commit `993d82f`; change `WORKER755_COMMIT` in `Dockerfile.vercel` to upgrade.

## How to use

Deploy with the button, or from this folder:

```bash
vercel env add AI_GATEWAY_API_KEY   # optional: free shifts on the server's key
vercel deploy --prod
```

Then open `https://<your-deployment>.vercel.app/`. Without `AI_GATEWAY_API_KEY`, every player brings their own AI Gateway or OpenRouter key on the start screen. The key is sent to the game server when a shift starts and kept only in that shift's memory.

## Environment variables

See [`.env.example`](./.env.example) and the upstream [`.env.example`](https://github.com/gulivan/worker755/blob/main/.env.example) for every option.

| Variable | Required | Meaning |
| --- | --- | --- |
| `AI_GATEWAY_API_KEY` | No | An [AI Gateway API key](https://vercel.com/docs/ai-gateway/authentication-and-byok/api-keys). Enables free shifts on the server's key. Without it, players bring their own key. |
| `FREE_MODELS` | No | Models free shifts may use, comma separated, in AI Gateway naming. |
| `FREE_SHIFT_TOKENS`, `FREE_DAILY_TOKENS`, `FREE_SHIFTS_PER_DAY` | No | Free-shift limits (only with `AI_GATEWAY_API_KEY`). |
| `PUBLIC_URL` | No | The deployment's public URL, used in links shown to players. |
| `PORT` | No | `80` in the image, which is what Vercel expects. |
| `DATA_DIR` | No | `/tmp/worker755` in the image: the only writable path on Vercel Functions. |
| `SHARING` | No | `0` in the image. See caveats. |

## Test locally

Requires Docker and Python 3. The smoke test runs the image against a fake OpenAI-compatible model server that plays the manager, through the game's `LOCAL_LLM_URL` setting, so no real keys are used.

```bash
docker build -f Dockerfile.vercel -t worker755-on-vercel .
bash local-test/smoke-test.sh
```

Expected output:

```
PASS  web app (200)
PASS  serves the built web app
PASS  game config (200)
PASS  rejects a shift with no key (400)
PASS  lists the model server's models (200)
PASS  mock model offered
PASS  starts a shift (201)
PASS  shift has an id
PASS  event stream (text/event-stream)
PASS  manager instruction streamed to the player
PASS  manager called the model with its tools
PASS  default PORT 80
PASS  clean SIGTERM shutdown (exit 0 in 0s)
All checks passed.
```

## Caveats

- **Shifts live in one instance's memory.** A shift, its event stream and its follow-up requests are kept in the server process. Vercel can run several instances and [local memory is not shared between them](https://vercel.com/kb/guide/does-vercel-support-docker-deployments), so under load a request for a shift can reach an instance that doesn't know it. This works for light traffic; a busy deployment needs the session state moved to a shared store such as Redis from the Vercel Marketplace, which is an upstream code change.
- **Event streams are bounded by the function's [maximum duration](https://vercel.com/docs/functions/configuring-functions/duration).** The browser's `EventSource` reconnects with `Last-Event-ID`, and the server resumes from it, as long as the reconnect reaches the same instance.
- **No persistent disk.** Stats and shift logs go to `/tmp` and disappear with the instance. Review sharing is off (`SHARING=0`) because a shared link would only resolve on the instance that wrote it. Sign-in and top-ups (`AUTH_SECRET`, Freemius) store accounts in a local SQLite file, so they aren't suitable here without moving that data to a hosted database.
- **The AI Gateway path wasn't exercised by the smoke test.** The game has no base-URL override for AI Gateway, so the test drives the same manager loop through the OpenAI-compatible local-model setting instead.

## Learn more

- [Container runtime on Vercel Functions](https://vercel.com/docs/functions/runtimes/container)
- [Running Docker on Vercel](https://vercel.com/kb/guide/docker)
- [AI Gateway authentication](https://vercel.com/docs/ai-gateway/authentication-and-byok)
- [Worker 755 on GitHub](https://github.com/gulivan/worker755)
