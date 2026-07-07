# Product Definition

## What is it?

This is a Next.js reference template demonstrating reliable message queue processing using Valkey streams on AWS ElastiCache. It implements a contact form processor where messages are queued, consumed, and acknowledged — showcasing Valkey as a production-ready alternative to Redis for serverless queue workflows on Vercel.

## What problem does it solve?

Developers evaluating Valkey with Vercel lack a concrete, deployable example showing how stream-based message queues work in a serverless environment.

- **No reference pattern**: Valkey streams are powerful but under-documented for serverless use cases — this template provides a copy-paste starting point
- **Redis lock-in assumption**: Teams assume Redis is the only option for queue workloads on Vercel — this demonstrates Valkey + ElastiCache as a viable, compatible alternative
- **Reliability gap**: Naive queue implementations lose messages on consumer failure — this template shows consumer groups, pending entry lists, and auto-reclaim working together

## Who is it for?

- Developers evaluating AWS ElastiCache with Valkey for their Vercel-deployed applications
- Teams migrating from Redis who want to verify Valkey stream compatibility
- Engineers learning the produce → consume → acknowledge pattern in a serverless context

## Why does it exist?

- **Redis examples** exist for Vercel, but no equivalent exists showing Valkey via GLIDE with ElastiCache
- **Generic Valkey docs** explain streams in isolation, but don't demonstrate the serverless deployment model (cold starts, stateless functions, VPC connectivity)

This template fills the gap: a deployable, production-shaped example that proves Valkey streams work with Vercel Functions via AWS ElastiCache.

## How is it used?

1. Clone the template and configure the Valkey endpoint
2. Submit messages via the contact form (producer)
3. Open the processing view to consume queued messages (consumer)
4. Acknowledge each message to remove it from the pending list
5. Observe reliability: abandoned messages auto-reclaim after 60 seconds

## Vocabulary

| Term | Definition |
|------|-----------|
| **message** | A contact form submission (name, email, body) stored as a stream entry |
| **queue** | The Valkey stream holding unprocessed messages |
| **producer** | The form submission flow that appends entries to the stream |
| **consumer** | The processing view that reads and displays the next pending message |
| **acknowledge** | The act of confirming a message is processed, removing it from the pending list |
| **reclaim** | Automatic recovery of a message that was delivered but never acknowledged within the idle timeout |
| **pending list** | Valkey's Pending Entries List (PEL) — messages delivered to a consumer but not yet acknowledged |
