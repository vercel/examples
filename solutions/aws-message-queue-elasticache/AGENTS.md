# AGENTS.md

Next.js reference template demonstrating reliable message queue processing with Valkey streams (AWS ElastiCache) via the GLIDE client.


### Critical constraint

**Never use Redis client libraries.** Always use `@valkey/valkey-glide`. This project exists to showcase Valkey GLIDE as a Redis alternative.
