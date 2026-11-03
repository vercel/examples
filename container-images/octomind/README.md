---
name: Octomind on Vercel
slug: octomind-container
description: Run Octomind, an open-source Rust coding agent harness, as a WebSocket server on Vercel Functions with a container image and AI Gateway.
framework:
  - Other
type:
  - Starter
  - AI
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/octomind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/octomind&project-name=octomind&repository-name=octomind&env=OCTOMIND_SERVER_TOKEN,AI_GATEWAY_API_KEY
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# Octomind on Vercel

Run [Octomind](https://github.com/muvon/octomind), an open-source coding agent harness written in Rust, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). Octomind's [WebSocket server](https://github.com/muvon/octomind/blob/master/doc/integration/01-websocket-server.md) lets web clients, bots and dashboards open agent sessions and stream the replies, and every model call goes through [AI Gateway](https://vercel.com/docs/ai-gateway).

This example contains no Octomind code. `Dockerfile.vercel` downloads the pinned Octomind release binary, checks its SHA-256, and ships it on `debian:bookworm-slim` with `git` and `ripgrep` for the agent's tools. `start.sh` maps the environment variables below onto Octomind's own settings and starts `octomind server` on `0.0.0.0:$PORT`.

> This example pins Octomind `0.69.0`. To upgrade, change `OCTOMIND_VERSION` and both `OCTOMIND_SHA256_*` values in `Dockerfile.vercel` (each release publishes a `.sha256` file next to its archive).

## How it works

- **Container runtime.** `vercel.json` defines one `container` service with a catch-all rewrite, so every request reaches the Octomind server.
- **WebSockets.** Clients connect with `Authorization: Bearer <OCTOMIND_SERVER_TOKEN>`. Handshakes without the right token get `401`.
- **AI Gateway.** Octomind's `local:` provider speaks the OpenAI Chat Completions API, which AI Gateway serves at `https://ai-gateway.vercel.sh/v1/chat/completions`. The main, supervisor and compression models all use `OCTOMIND_MODEL`.
- **Filesystem sandbox.** The server runs with `--sandbox`, so the agent, its shells and its MCP servers can only write to `/workspace` (plus Octomind's data and temp paths).
- **No startup downloads.** The default role is `assistant`, which is defined in Octomind's built-in config.

## How to use

Deploy with the button, or from this folder:

```bash
vercel env add OCTOMIND_SERVER_TOKEN   # e.g. the output of: openssl rand -hex 32
vercel env add AI_GATEWAY_API_KEY
vercel deploy --prod
```

Then connect with any WebSocket client, for example [websocat](https://github.com/vi/websocat):

```bash
websocat -H "Authorization: Bearer $OCTOMIND_SERVER_TOKEN" wss://<your-deployment>.vercel.app/
```

Send one JSON frame per line to create a session and then prompt it:

```json
{"type":"session","request_id":"s1","session_id":"demo"}
{"type":"message","request_id":"m1","session_id":"demo","content":"What can you do?"}
```

The server answers with `ack` and `status` frames, streams `assistant` frames, and ends each turn with a `cost` frame. See the [protocol reference](https://github.com/muvon/octomind/blob/master/doc/integration/01-websocket-server.md#protocol).

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `OCTOMIND_SERVER_TOKEN` | Yes | Shared secret every client sends as `Authorization: Bearer <token>`. The container refuses to start without it. |
| `AI_GATEWAY_API_KEY` | Yes | AI Gateway API key used for every model call. |
| `OCTOMIND_MODEL` | No | Any AI Gateway model id. Defaults to `anthropic/claude-sonnet-5`. |
| `OCTOMIND_ROLE` | No | Role or tap agent to run. Defaults to `assistant`. A tap agent such as `developer:general` is downloaded, with its tools, when the server starts. |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |

## Test locally

Requires Docker and Python 3. The smoke test runs the image against a fake AI Gateway (`local-test/mock_llm.py`) and drives it with a small WebSocket client (`local-test/ws_client.py`), both standard library only, so no real keys are used.

```bash
docker build -f Dockerfile.vercel -t octomind-on-vercel .
bash local-test/smoke-test.sh
```

Expected output (the exit time varies):

```
PASS  server listening on $PORT (8080)
PASS  rejects missing token (401)
PASS  rejects wrong token (401)
PASS  accepts token, sends welcome frame
PASS  creates a session
PASS  streams the agent reply over the WebSocket
PASS  ends the turn with a cost frame
PASS  model calls use the AI Gateway key and model id
PASS  server token never sent upstream
PASS  SIGTERM stops the container (exit 143, 62 ms)
PASS  refuses to start without OCTOMIND_SERVER_TOKEN
PASS  default PORT=80 as non-root user
All checks passed.
```

## Caveats

- **One identity per deployment.** Octomind's server has no notion of users: config, MCP servers and credentials are shared by every session, and any client with the token can resume any session. Treat the token like an API key and deploy one project per team or user.
- **Per-instance state.** Sessions are saved under `/tmp/octomind`, which is not persistent or shared. A [WebSocket connection](https://vercel.com/docs/functions/websockets) stays on one instance until it closes, and a reconnect can land on another instance, so a resumed session may start fresh. Keep sessions short-lived or move them to external storage.
- **Connection duration.** WebSocket connections close when the function reaches its maximum duration. Clients should reconnect and resume by `session_id`.
- **WebSocket only.** The server does not answer plain HTTP requests, so there is no health or landing page.
- **Untrusted code.** `--sandbox` only restricts file writes. For agents that clone and run untrusted repositories, run Octomind inside [Vercel Sandbox](https://vercel.com/docs/sandbox) instead, one microVM per task.

## Learn more

- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [WebSockets on Vercel Functions](https://vercel.com/docs/functions/websockets)
- [AI Gateway Chat Completions API](https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions)
- [Octomind documentation](https://octomind.run/docs/)
