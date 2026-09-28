import type {
  SandboxSession,
  SandboxProcess,
  SandboxSpawnOptions,
} from 'eve/sandbox'
import {
  defineSandboxProvider,
  type SandboxProviderHandle,
} from 'eve/sandbox/provider'
import { Sandbox } from '@vercel/sandbox'
import {
  openWorkspace,
  projectPath,
  restartPreview,
  previewOutput,
  startPreview,
  WORKSPACE,
} from '../../lib/workspace'

interface ProjectSandboxSession extends SandboxSession {
  name: string
  spawn(
    options: SandboxSpawnOptions
  ): Promise<SandboxProcess & { commandId: string }>
  preview: {
    current(): ReturnType<typeof previewOutput>
    start(command: string, args: string[]): ReturnType<typeof startPreview>
  }
}

// Keep native SDK objects inside this adapter; tools use eve I/O and preview capabilities.
// eve checkpoints its name and owns the compute lifecycle; the drive outlives it.
export const ProjectSandbox = defineSandboxProvider<
  undefined,
  undefined,
  { image: string; region: string },
  { name: string },
  ProjectSandboxSession
>({
  name: 'vibe-project',
  environment: () => ({
    async prepare() {
      return {
        image: 'vercel/sandbox/node:24',
        region: process.env.SANDBOX_REGION ?? 'iad1',
      }
    },
    async start(ctx, _options, artifact) {
      const native = await openWorkspace(ctx.session.id, artifact)
      return {
        handle: adaptProjectSandbox(native),
        state: { name: native.name },
      }
    },
    async resume(_ctx, _artifact, state) {
      return adaptProjectSandbox(
        await Sandbox.get({
          name: state.name,
          resume: true,
          onResume: restartPreview,
        })
      )
    },
  }),
})

export function adaptProjectSandbox(
  native: Sandbox
): SandboxProviderHandle<ProjectSandboxSession> {
  const sandbox: ProjectSandboxSession = {
    name: native.name,
    preview: {
      current: () => previewOutput(native),
      start: (command, args) => startPreview(native, command, args),
    },
    resolvePath: projectPath,
    async run(options) {
      const process = await sandbox.spawn(options)
      const [result, stdout, stderr] = await Promise.all([
        process.wait(),
        new Response(process.stdout).text(),
        new Response(process.stderr).text(),
      ])
      return { exitCode: result.exitCode, stdout, stderr }
    },
    async spawn({ command, workingDirectory, env, abortSignal }) {
      const process = await native.runCommand({
        cmd: 'bash',
        args: ['-lc', command],
        cwd: workingDirectory ?? WORKSPACE,
        env,
        signal: abortSignal,
        detached: true,
      })
      const onAbort = () => {
        void process.kill().catch(() => {})
      }
      if (abortSignal?.aborted) onAbort()
      else abortSignal?.addEventListener('abort', onAbort, { once: true })
      const detach = () => abortSignal?.removeEventListener('abort', onAbort)
      const logs = process.logs({ signal: abortSignal })
      const stream = new ReadableStream<{ stream: string; data: string }>({
        async pull(controller) {
          const next = await logs.next()
          if (next.done) controller.close()
          else controller.enqueue(next.value)
        },
        async cancel() {
          await logs.return?.()
        },
      })
      const [stdout, stderr] = stream.tee()
      const filter = (name: string) =>
        new TransformStream<{ stream: string; data: string }, Uint8Array>({
          transform(log, controller) {
            if (log.stream === name)
              controller.enqueue(new TextEncoder().encode(log.data))
          },
        })
      return {
        commandId: process.cmdId,
        stdout: stdout.pipeThrough(filter('stdout')),
        stderr: stderr.pipeThrough(filter('stderr')),
        wait: async () => {
          try {
            return {
              exitCode: (await process.wait({ signal: abortSignal })).exitCode,
            }
          } finally {
            detach()
          }
        },
        kill: async () => {
          try {
            await process.kill()
          } finally {
            detach()
          }
        },
      }
    },
    async readBinaryFile({ path, abortSignal }) {
      return native.readFileToBuffer(
        { path: projectPath(path) },
        { signal: abortSignal }
      )
    },
    async readFile(options) {
      const content = await sandbox.readBinaryFile(options)
      return content === null
        ? null
        : new Response(new Uint8Array(content)).body
    },
    async readTextFile({
      startLine = 1,
      endLine,
      encoding = 'utf8',
      ...options
    }) {
      const content = await sandbox.readBinaryFile(options)
      if (!content) return null
      if (!Buffer.isEncoding(encoding)) throw new Error('Unsupported encoding')
      return Buffer.from(content)
        .toString(encoding)
        .split('\n')
        .slice(startLine - 1, endLine)
        .join('\n')
    },
    async writeBinaryFile({ path, content, abortSignal }) {
      await native.writeFiles(
        [{ path: projectPath(path), content: Buffer.from(content) }],
        { signal: abortSignal }
      )
    },
    async writeFile({ content, ...options }) {
      await sandbox.writeBinaryFile({
        ...options,
        content: new Uint8Array(await new Response(content).arrayBuffer()),
      })
    },
    async writeTextFile({ content, encoding = 'utf8', ...options }) {
      if (!Buffer.isEncoding(encoding)) throw new Error('Unsupported encoding')
      await sandbox.writeBinaryFile({
        ...options,
        content: Buffer.from(content, encoding),
      })
    },
    async removePath({ path, force, recursive, abortSignal }) {
      await native.fs.rm(projectPath(path), {
        force,
        recursive,
        signal: abortSignal,
      })
    },
  }
  return {
    sandbox,
    onRuntimeShutdown: async () => {},
    onSessionStop: async () => {
      await native.stop()
    },
    onSessionDelete: async () => {
      await native.delete()
    },
  }
}
