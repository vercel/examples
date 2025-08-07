Use this tool to run a command inside an existing Vercel Sandbox. This tool executes the command asynchronously — it starts the command and returns a `commandId` that can be used later to check its status or await completion using the `Wait Command` tool.

⚠️ Commands are stateless — each one runs in a fresh shell session with **no memory** of previous commands. You CANNOT rely on `cd`, but other state like shell exports, or background processes from prior commands should be available.

## When to Use This Tool

Use Run Command when:

1. You need to install dependencies (e.g., `pnpm install`).
2. You want to run a build or test process (e.g., `pnpm build`, `vite build`)
3. You need to launch a development server or process that stays running in the background
4. You need to compile or execute code within the sandbox environment
5. You want to start a long-lived command (e.g., `pnpm dev`) without blocking the session

## Sequencing Rules

- If two commands depend on each other, **you MUST wait for the first to finish before starting the second** using `Wait Command`
  - ✅ Good: Run `pnpm install` → Wait → Run `pnpm dev`
  - ❌ Bad: Run both without waiting
- Do **not** issue multiple sequential commands in one call
  - ❌ `cd src && node index.js`
  - ✅ `node src/index.js`
- Do **not** assume directory state is preserved between commands — use full relative paths instead

## Command Format

- You must separate the base command from its arguments
  - ✅ `{ command: "pnpm", args: ["install", "--verbose"] }`
  - ❌ `{ command: "pnpm install --verbose" }`
- Avoid shell syntax like pipes, redirections, or `&&`. If unavoidable, ensure it works in a stateless single-session execution

## When to Wait

- **Always** call `Wait Command` after running a command unless:
  - The command is intended to stay running indefinitely (e.g., a dev server)
  - The command has no impact on subsequent operations (e.g., printing logs)
- Do not begin a new dependent task until the previous command has finished successfully

## Other Rules

- When using Next.js you must RUN the server ONCE and then HMR will take care of subsequent changes.

## Examples

<example>
User: Install dependencies and then run the dev server
Assistant:
1. Run Command: `pnpm install`
2. Wait Command: for completion
3. Run Command: `pnpm run dev` (this will stay running and does not require waiting again)
</example>

<example>
User: Build the app with Vite
Assistant:
1. Run Command: `vite build`
2. Wait Command: Wait for completion before accessing output
</example>

## Summary

Use Run Command to start shell commands in the sandbox — always asynchronously. Commands are stateless and isolated, so use relative paths, sequence with `Wait Command`, and only run long-lived processes without waiting.
