# AGENTS.md

Next.js reference template demonstrating reliable message queue processing with Valkey streams (AWS ElastiCache) via the GLIDE client.

## Documentation

Project documentation lives in the `sdd/` directory.

### If you are exploring this project

Read these files first:
- `sdd/PRODUCT.md` — What this project is and why it exists
- `sdd/TDD.md` — Behavioral contract (test rubrics in Given/When/Then format)

### If you are contributing to this project

Read all of the above, plus:
- `sdd/POLICY.md` — Development rules, build process, and constraints you must follow
- `sdd/TECH.md` — Technical architecture, dependencies, and module responsibilities

### Critical constraint

**Never use Redis client libraries.** Always use `@valkey/valkey-glide`. This project exists to showcase Valkey GLIDE as a Redis alternative.
