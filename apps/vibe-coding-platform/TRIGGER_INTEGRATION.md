# Vibe Code x E2B x Trigger.dev Integration

This project uses **E2B Sandboxes** for persistent code execution and **Trigger.dev** for task orchestration.

## Setup and Choices

### 1. Persistent Execution with E2B

We use E2B Sandboxes to provide a real Linux environment for code execution.

- **True Persistence**: Files written to the sandbox persist between command executions.
- **Isolated Environments**: Each sandbox is a secure, isolated cloud environment.
- **E2B SDK**: Integrated directly into AI tools for file management and execution.

### 2. Orchestration with Trigger.dev v3

Trigger.dev manages the execution of shell commands within the E2B sandbox.

- **Reliability**: Handles task triggering and provides full observability.
- **Log Collection**: Captures execution outputs and streams them back to the UI.

### 3. Log Streaming

The log streaming API in `app/api/sandboxes/[sandboxId]/cmds/[cmdId]/logs` polls the Trigger.dev run status to provide real-time updates and execution results to the frontend.

## Environment Variables

Ensure you have the following in your `.env.local`:

- `E2B_API_KEY`: Your E2B API Key.
- `TRIGGER_API_KEY`: Your Trigger.dev v3 API Key.

## Development

```bash
# Start Trigger.dev dev server
npx trigger.dev@latest dev

# Start Next.js
npm run dev
```
