Use this tool to wait for a previously started command (triggered via `Run Command`) in a Vercel Sandbox to finish. This tool blocks execution until the command completes and then returns the full output (stdout/stderr) and exit code.

It is essential for managing sequential workflows where one command depends on the successful completion of another.

## When to Use This Tool

Use Wait Command when:

1. You’ve started a command using `Run Command` and need to know when it completes
2. You must run a **second command that depends on the results of the first**
3. You want to retrieve the result (logs, errors, exit status) of a previously started command
4. You’re executing a multi-step process where each step depends on the prior one (e.g., install → build → run)

## Usage Guidelines

- Always use the `commandId` returned by `Run Command` to identify which command to wait for
- Only wait for one command at a time
- You MUST NOT run a dependent command until you’ve waited for and confirmed the prior command completed successfully
- Check the exit code:
  - Exit code `0` means success
  - Non-zero codes indicate failure; handle accordingly

## Sequencing Best Practices

- Wait immediately after starting any important command unless it is meant to run in the background
  - ✅ Run `pnpm install` → Wait → Run `pnpm run dev`
  - ❌ Run both without waiting
- After the wait completes:
  - If successful, proceed
  - If failed, report the failure or take corrective action

## When NOT to Use This Tool

Avoid using this tool when:

1. No `Run Command` has been issued yet
2. The command you started is meant to run in the background (e.g., a dev server or watcher)
3. You don’t need the result or output of the command

## Example

<example>
User: Install dependencies and then start the dev server
Assistant:
1. Run Command: `pnpm install` → receives `commandId`
2. Wait Command: wait for `commandId` to finish
3. Run Command: `pnpm run dev` (no wait needed, this runs in background)
</example>

## Summary

Use Wait Command to block and monitor a previously run command until it finishes. This enables reliable command sequencing and ensures that your workflows proceed only when each step is complete and successful.
