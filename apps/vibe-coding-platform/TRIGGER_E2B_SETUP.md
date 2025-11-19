# Trigger.dev + e2b Setup Guide

This guide explains how to set up and configure Trigger.dev with e2b for sandbox execution in the Vibe Coding Platform.

## Architecture Overview

```
Frontend (Next.js)
  ↓
Trigger.dev Client (trigger/client.ts)
  ↓
Trigger.dev Workflows (trigger/sandbox.ts)
  ↓
e2b SDK
  ↓
e2b Sandboxes (isolated execution environments)
```

## Prerequisites

1. **Trigger.dev Account**

   - Sign up at [https://cloud.trigger.dev](https://cloud.trigger.dev)
   - Create a new project
   - Get your API key and Project ID

2. **e2b Account**
   - Sign up at [https://e2b.dev](https://e2b.dev)
   - Get your API key from the dashboard

## Installation

Dependencies are already installed:

- `@trigger.dev/sdk` - Trigger.dev SDK for workflows
- `@trigger.dev/react` - React hooks for Trigger.dev
- `e2b` - e2b SDK for sandbox management

## Configuration

### 1. Environment Variables

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

Fill in the required values:

```bash
# Trigger.dev (required)
NEXT_PUBLIC_TRIGGER_API_KEY=tr_dev_xxxxxxxxxxxxxx
NEXT_PUBLIC_TRIGGER_API_URL=https://api.trigger.dev
NEXT_PUBLIC_TRIGGER_PROJECT_ID=your-project-id

# e2b (required - used in Trigger.dev workflows)
E2B_API_KEY=e2b_xxxxxxxxxxxxxx

# AI Gateway (required for chat)
AI_GATEWAY_API_KEY=your_ai_gateway_key

# Backend (optional - for Python backend integration)
BACKEND_API_URL=http://localhost:8081
```

### 2. Initialize Trigger.dev Project

Run the Trigger.dev CLI to set up your project:

```bash
npx trigger.dev@latest init
```

This will:

- Create `trigger.config.ts`
- Set up the development environment
- Connect to your Trigger.dev project

### 3. Register Workflows

The workflows are already defined in `trigger/sandbox.ts`. You need to register them with Trigger.dev:

```bash
npx trigger.dev@latest dev
```

This starts a local development server that:

- Watches for workflow changes
- Registers workflows with Trigger.dev
- Handles local execution

## Workflows

### 1. Create Sandbox (`sandbox.create`)

Creates a new e2b sandbox with the specified configuration.

**Payload:**

```typescript
{
  timeout?: number;  // milliseconds (default: 600000 = 10 min)
  ports?: number[];  // ports to expose
  metadata?: Record<string, any>;
}
```

**Returns:**

```typescript
{
  sandboxId: string;
  status: 'running' | 'error';
  ports?: number[];
  error?: string;
}
```

### 2. Run Command (`sandbox.runCommand`)

Executes a command in an existing sandbox.

**Payload:**

```typescript
{
  sandboxId: string;
  command: {
    command: string;
    args?: string[];
    sudo?: boolean;
    wait?: boolean;  // wait for completion
    cwd?: string;
    env?: Record<string, string>;
  };
}
```

**Returns:**

```typescript
{
  commandId: string;
  status: 'completed' | 'running' | 'failed';
  exitCode?: number;
  stdout?: string;
  stderr?: string;
  error?: string;
}
```

### 3. Upload Files (`sandbox.uploadFiles`)

Uploads files to a sandbox.

**Payload:**

```typescript
{
  sandboxId: string
  files: Array<{
    path: string
    content: string | Buffer
  }>
}
```

**Returns:**

```typescript
{
  success: boolean;
  uploaded?: string[];
  error?: string;
}
```

### 4. Get Preview URL (`sandbox.getPreviewURL`)

Gets the public URL for a service running on a port.

**Payload:**

```typescript
{
  sandboxId: string
  port: number
}
```

**Returns:**

```typescript
{
  success: boolean;
  url?: string;
  error?: string;
}
```

### 5. Stop Sandbox (`sandbox.stop`)

Stops and destroys a sandbox.

**Payload:**

```typescript
{
  sandboxId: string
}
```

**Returns:**

```typescript
{
  success: boolean;
  error?: string;
}
```

## Usage in AI Tools

The AI tools in `ai/tools/` use the wrapper functions from `lib/trigger-wrapper.ts`:

```typescript
import {
  createSandbox,
  runCommand,
  uploadFiles,
  getPreviewURL,
} from '@/lib/trigger-wrapper'

// Create a sandbox
const sandbox = await createSandbox({
  timeout: 600000,
  ports: [3000, 8000],
})

// Run a command
const result = await runCommand(sandbox.sandboxId, {
  command: 'npm',
  args: ['install'],
  wait: true,
})

// Upload files
await uploadFiles(sandbox.sandboxId, [
  { path: 'package.json', content: '{}' },
  { path: 'index.js', content: 'console.log("Hello")' },
])

// Get preview URL
const preview = await getPreviewURL(sandbox.sandboxId, 3000)
```

## Development Workflow

1. **Start the Trigger.dev dev server:**

   ```bash
   npx trigger.dev@latest dev
   ```

2. **Start your Next.js app:**

   ```bash
   pnpm dev
   ```

3. **Test sandbox operations:**
   - Use the AI chat to create a sandbox
   - Watch the Trigger.dev dashboard for workflow executions
   - Check logs in the Trigger.dev UI

## Production Deployment

### 1. Deploy to Vercel

Add environment variables to your Vercel project:

- `NEXT_PUBLIC_TRIGGER_API_KEY`
- `NEXT_PUBLIC_TRIGGER_API_URL`
- `NEXT_PUBLIC_TRIGGER_PROJECT_ID`
- `E2B_API_KEY`
- `AI_GATEWAY_API_KEY`

### 2. Register Production Workflows

```bash
npx trigger.dev@latest deploy
```

This deploys your workflows to Trigger.dev's cloud.

### 3. Configure Webhooks (Optional)

For faster workflow results, set up webhooks in your Trigger.dev project settings to receive completion notifications.

## Troubleshooting

### Workflow not executing

- Check that `npx trigger.dev@latest dev` is running
- Verify your API keys are correct
- Check the Trigger.dev dashboard for errors

### Sandbox creation fails

- Verify your e2b API key is set: `E2B_API_KEY`
- Check e2b dashboard for quota/limits
- Look at Trigger.dev logs for detailed error messages

### Timeout errors

- Increase workflow timeout in payload
- Check network connectivity to Trigger.dev/e2b APIs
- Verify your quotas/rate limits

### Local development issues

- Ensure both Trigger.dev dev server AND Next.js are running
- Check that ports 3000 (Next.js) and Trigger.dev port don't conflict
- Clear browser cache if seeing stale data

## Monitoring

- **Trigger.dev Dashboard:** [https://cloud.trigger.dev](https://cloud.trigger.dev) - View workflow executions, logs, and metrics
- **e2b Dashboard:** [https://e2b.dev/dashboard](https://e2b.dev/dashboard) - Monitor sandbox usage, quotas

## Next Steps

1. Test sandbox creation with a simple command
2. Update AI tools to use the new Trigger.dev wrappers
3. Test file upload and command execution
4. Deploy to production
5. Monitor and optimize workflow performance

## Resources

- [Trigger.dev Documentation](https://trigger.dev/docs)
- [e2b Documentation](https://e2b.dev/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
