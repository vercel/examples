# Security Review: message-queue-elasticache

**Date**: 2026-05-07
**Reviewer**: Automated Security Review
**Files Reviewed**:
- `app/api/messages/route.ts`
- `app/page.tsx`
- `app/process/page.tsx`

## Summary
- **Findings**: 3 HIGH, 4 MEDIUM
- **Risk Level**: High
- **Confidence**: High/Mixed

---

## HIGH Confidence Findings

**[HIGH]** `app/api/messages/route.ts:86-95` — No input length limits on name/email/message fields. The `validateContactForm` function checks only for presence and type (`typeof === 'string'`), but enforces no maximum length. An attacker can POST megabytes of data per field, which gets stored verbatim in the Valkey stream via `xadd`. Exploitation: send a POST with a 100MB `message` field repeatedly to exhaust Valkey memory (OOM), causing denial of service for all consumers.

**[HIGH]** `app/api/messages/route.ts:1-236` — No authentication or authorization on any endpoint. The POST (produce), GET (consume), and DELETE (acknowledge) handlers are completely open. Any anonymous internet user can: (1) spam the queue with garbage messages, (2) consume/steal messages containing PII (name, email, message content) intended for reviewers, (3) acknowledge messages without processing them, permanently removing them from the queue. Exploitation: an attacker calls `GET /api/messages` in a loop to drain all queued messages and harvest user PII.

**[HIGH]** `app/api/messages/route.ts:67-70` — Error handler leaks internal error messages to clients. The `handleError` function returns `error.message` directly in the JSON response. Valkey connection errors expose the endpoint hostname/port (e.g., `"Failed to produce message. Connection refused: valkey-prod.internal:6379"`). Exploitation: trigger errors (e.g., malformed JSON body) to enumerate internal infrastructure details.

---

## MEDIUM — Needs Verification

**[MEDIUM]** `app/api/messages/route.ts:28-40` — Valkey connection has no TLS configuration. The `GlideClientConfiguration` only sets `addresses` with no `useTLS: true` or certificate options. If this connects to ElastiCache over the network (not localhost), credentials and message data transit in plaintext. Verify: whether the deployment uses VPC-internal networking or requires TLS for ElastiCache in-transit encryption.

**[MEDIUM]** `app/api/messages/route.ts:17` — Singleton client pattern with no reconnection handling or connection pooling. If the module-level `client` variable holds a stale/broken connection, all subsequent requests fail until the process restarts. Under load, a single connection becomes a bottleneck. Verify: whether Next.js serverless function lifecycle mitigates this (cold starts create new connections).

**[MEDIUM]** `app/api/messages/route.ts:108-113` — No rate limiting on message production. Combined with the lack of input size limits, an attacker can flood the stream with unlimited messages. The stream grows unbounded (no `MAXLEN` on `xadd`), consuming Valkey memory until OOM. Verify: whether infrastructure-level rate limiting (API Gateway, WAF, Vercel edge) exists in front of this endpoint.

**[MEDIUM]** `app/api/messages/route.ts:108` — `request.json()` has no body size enforcement at the application level. Next.js has a default body size limit (~1MB for API routes), which partially mitigates the input length issue, but this is framework-dependent and not explicitly configured. Verify: confirm Next.js 16 default body parser limits are active for this route handler.
