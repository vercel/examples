import { Drive, Sandbox } from '@vercel/sandbox'
import { posix } from 'node:path'
import { z } from 'zod'
import { workspaceName } from './project-auth'

export const WORKSPACE = '/workspace'
const previewConfig = '/workspace/.vibe/preview.json'
const previewSchema = z.object({
  command: z.string(),
  args: z.array(z.string()),
  commandId: z.string().optional(),
})

async function readPreview(sandbox: Sandbox) {
  const config = await sandbox.readFileToBuffer({ path: previewConfig })
  return config ? previewSchema.parse(JSON.parse(config.toString())) : null
}

export async function previewOutput(sandbox: Sandbox) {
  if (!(await previewReady(sandbox))) return null
  const config = await readPreview(sandbox)
  return {
    ...config,
    sandboxId: sandbox.name,
    url: sandbox.domain(3000),
    status: 'running' as const,
  }
}

export function projectPath(path: string) {
  const resolved = posix.resolve(WORKSPACE, path)
  if (!resolved.startsWith(`${WORKSPACE}/`) || path.includes('\0')) {
    throw new Error('Choose a file inside /workspace.')
  }
  return resolved
}

export async function launchPreview(
  sandbox: Sandbox,
  command: string,
  args: string[]
) {
  const process = await sandbox.runCommand({
    cmd: command,
    args,
    cwd: WORKSPACE,
    detached: true,
  })
  return {
    sandboxId: sandbox.name,
    commandId: process.cmdId,
    command,
    args,
    status: 'running' as const,
  }
}

export async function restartPreview(sandbox: Sandbox) {
  try {
    const config = await readPreview(sandbox)
    if (config) {
      const { command, args } = config
      await startPreview(sandbox, command, args)
    }
  } catch (error) {
    // A broken preview must not prevent the agent from opening and repairing files.
    console.warn('Could not restart workspace preview:', error)
  }
}

export async function openWorkspace(
  sessionId: string,
  options = {
    image: 'vercel/sandbox/node:24',
    region: process.env.SANDBOX_REGION ?? 'iad1',
  }
) {
  const name = workspaceName(sessionId)
  const drive = await Drive.getOrCreate({ name, region: options.region })
  return Sandbox.getOrCreate({
    name,
    image: options.image,
    persistent: true,
    region: options.region,
    mounts: { [WORKSPACE]: drive },
    ports: [3000],
    timeout: 10 * 60 * 1000,
    resume: true,
    onCreate: restartPreview,
    onResume: restartPreview,
  })
}

export async function listFiles(sandbox: Sandbox) {
  const result = await sandbox.runCommand({
    cmd: 'find',
    args: [
      '.',
      '-type',
      'd',
      '(',
      '-name',
      'node_modules',
      '-o',
      '-name',
      '.next',
      '-o',
      '-name',
      '.git',
      '-o',
      '-name',
      '.vibe',
      ')',
      '-prune',
      '-o',
      '-type',
      'f',
      '-print',
    ],
    cwd: WORKSPACE,
  })
  if (result.exitCode !== 0) throw new Error(await result.stderr())
  return (await result.stdout())
    .split('\n')
    .filter(Boolean)
    .map((path) => path.replace(/^\.\//, ''))
}

export async function previewReady(sandbox: Sandbox) {
  const result = await sandbox.runCommand({
    cmd: 'node',
    args: [
      '-e',
      'fetch("http://127.0.0.1:3000", { signal: AbortSignal.timeout(2000) }).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))',
    ],
  })
  return result.exitCode === 0
}

export async function startPreview(
  sandbox: Sandbox,
  command: string,
  args: string[]
) {
  if (!(await previewReady(sandbox))) {
    await sandbox.writeFiles([
      {
        path: previewConfig,
        content: Buffer.from(JSON.stringify({ command, args })),
      },
    ])
    const process = await launchPreview(sandbox, command, args)
    await sandbox.writeFiles([
      {
        path: previewConfig,
        content: Buffer.from(
          JSON.stringify({ command, args, commandId: process.commandId })
        ),
      },
    ])
    for (let attempt = 0; attempt < 30; attempt++) {
      if (await previewReady(sandbox))
        return { ...process, url: sandbox.domain(3000) }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    throw new Error(
      `Preview did not become ready. Inspect command ${process.commandId} and fix its errors.`
    )
  }
  return previewOutput(sandbox)
}
