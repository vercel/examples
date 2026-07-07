# Technical Architecture

## System overview

```
┌─────────────────────────────────────────────────────────────┐
│  Vercel (Next.js App Router)                                │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌───────────────┐    │
│  │  / (page)    │   │ /process     │   │ /api/messages │    │
│  │  Submit form │   │ Review msgs  │   │ POST GET DEL  │    │
│  └──────┬───────┘   └──────┬───────┘   └───────┬───────┘    │
│         │                  │                   │            │
│         └──────────────────┼───────────────────┘            │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │ GLIDE client (TCP)
                             ▼
              ┌───────────────────────────────┐
              │  Valkey (ElastiCache / local) │
              │                               │
              │  Stream: contact-messages     │
              │  Consumer Group:              │
              │    contact-processors         │
              └───────────────────────────────┘
```

## Third-party packages

| Package | Version | Role |
|---------|---------|------|
| `@valkey/valkey-glide` | ^2.3.0 | Valkey client — stream operations (XADD, XREADGROUP, XAUTOCLAIM, XACK) |
| `next` | ^16.2.1 | App Router framework, API routes, React server components |
| `react` | ^19.2.4 | UI rendering |
| `@vercel/examples-ui` | ^2.0.1 | Shared UI components for Vercel example templates |

### Dev dependencies

| Package | Version | Role |
|---------|---------|------|
| `vitest` | ^2.1.0 | Unit test runner |
| `typescript` | ^5.1.6 | Type checking |
| `tailwindcss` | ^4.0.0 | Styling |
| `eslint` + `eslint-config-next` | ^8.45 | Linting |
| `turbo` | ^2.9.9 | Monorepo build orchestration |

## Integration boundaries

| Boundary | Constraint | Rationale |
|----------|-----------|-----------|
| GLIDE native module | `runtime = 'nodejs'` required — Edge runtime incompatible | `@valkey/valkey-glide` ships a compiled native binary (Rust/C via NAPI). Only the Node.js runtime supports native addons. |
| TCP to ElastiCache | VPC peering or PrivateLink required in production | ElastiCache clusters are private-network-only. Vercel Functions need Secure Compute or equivalent VPC connectivity. |
| Module singleton | Cold start creates new client; warm invocations reuse | The `GlideClient` is stored at module scope. A cold start reconnects via `getClient()`. Health-checked with PING before reuse. |

## Module responsibilities

| Module | Responsibility |
|--------|----------------|
| `app/api/messages/route.ts` | API route handler — POST (produce), GET (consume), DELETE (acknowledge). Manages GLIDE client lifecycle and consumer group creation |
| `app/api/messages/helpers.ts` | Input validation, stream field parsing, response building. Pure functions, no I/O |
| `app/page.tsx` | Contact form UI (producer) |
| `app/process/page.tsx` | Message review UI (consumer + acknowledge) |
| `__tests__/route.test.ts` | API route unit tests with mocked GLIDE client |
| `__tests__/helpers.test.ts` | Validation and parsing unit tests |

## Data model

**Stream name**: `contact-messages`
**Consumer group**: `contact-processors`
**Consumer name**: `consumer-{HOSTNAME || 'default'}`

Each stream entry contains:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Submitter name (max 200 chars) |
| `email` | string | Submitter email (max 320 chars) |
| `message` | string | Message body (max 10000 chars) |
| `timestamp` | string | ISO 8601 submission time |

Stream is capped at ~10000 entries via approximate MAXLEN trimming on XADD.

## Concurrency model

No multi-threading. Each Vercel Function invocation is a stateless request handler. Concurrency is managed by Valkey's consumer group semantics:

- **XREADGROUP** with `>` delivers each new message to exactly one consumer
- **XAUTOCLAIM** reclaims messages idle > 60s from failed consumers
- A module-level singleton `GlideClient` is reused across warm invocations within the same function instance (health-checked via PING)
- `groupCreated` flag avoids redundant XGROUP CREATE calls after first invocation

## Deployment

### Dual-repo structure

| Concern | Repo | Branch |
|---------|------|--------|
| PR source (canonical) | [`Bit-Quill/examples`](https://github.com/Bit-Quill/examples) | `message-queue-elasticache-clean` |
| Live demo (standalone) | [`Jonathan-Improving/vercel-valkey-message-queue-demo`](https://github.com/Jonathan-Improving/vercel-valkey-message-queue-demo) | `main` |

The demo fork exists because Vercel can't deploy a subfolder of a monorepo directly — it needs a standalone GitHub repo. The fork strips monorepo scaffolding (`vercel.ts`, `@vercel/config`, strict TS checking) to build independently. All application code is identical between the two.

### Vercel integration

| Detail | Value |
|--------|-------|
| Project | `aws-message-queue-elasticache` |
| Team | `jonathan-improvings-projects` |
| Domain | [aws-message-queue-elasticache.vercel.app](https://aws-message-queue-elasticache.vercel.app/) |
| Pipeline | Push to fork `main` → auto-deploy |

### Backport workflow

Changes land in the PR source first, then sync to the fork via `git format-patch` + `git apply -p3` (excluding `pnpm-lock.yaml` and `sdd/`). Cherry-pick is an alternative but can conflict on `package.json` and `next.config.js` where the fork diverges.
