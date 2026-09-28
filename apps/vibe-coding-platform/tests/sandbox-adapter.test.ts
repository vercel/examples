import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Sandbox } from '@vercel/sandbox'
import { adaptProjectSandbox } from '../agent/lib/project-sandbox'
import { commandLine, readOutputTail } from '../agent/lib/command-output'

test('adapter file methods share path resolution and byte I/O', async () => {
  const files = new Map<string, Buffer>()
  const native = {
    name: 'test',
    readFileToBuffer: async ({ path }: { path: string }) =>
      files.get(path) ?? null,
    writeFiles: async (values: { path: string; content: Buffer }[]) => {
      for (const file of values) files.set(file.path, file.content)
    },
    fs: {
      rm: async (path: string) => {
        files.delete(path)
      },
    },
  } as unknown as Sandbox
  const { sandbox } = adaptProjectSandbox(native)
  assert.equal('native' in sandbox, false)
  await sandbox.writeTextFile({ path: 'test.txt', content: 'one\ntwo\nthree' })
  assert.equal(
    await sandbox.readTextFile({ path: 'test.txt', startLine: 2, endLine: 2 }),
    'two'
  )
  await sandbox.writeTextFile({ path: 'empty.txt', content: '' })
  assert.equal(await sandbox.readTextFile({ path: 'empty.txt' }), '')
  assert.equal(await sandbox.readTextFile({ path: 'missing.txt' }), null)
  await sandbox.writeBinaryFile({
    path: 'bytes',
    content: Uint8Array.from([0, 255]),
  })
  assert.deepEqual(
    await sandbox.readBinaryFile({ path: 'bytes' }),
    Buffer.from([0, 255])
  )
  const stream = new Response('stream').body!
  await sandbox.writeFile({ path: 'stream', content: stream })
  assert.equal(
    await new Response(await sandbox.readFile({ path: 'stream' })).text(),
    'stream'
  )
  await sandbox.removePath({ path: 'test.txt' })
  assert.equal(await sandbox.readTextFile({ path: 'test.txt' }), null)
  await assert.rejects(async () =>
    sandbox.writeTextFile({ path: '../outside', content: '' })
  )
})

test('run consumes both process streams and preserves nonzero exit codes', async () => {
  const native = {
    name: 'test',
    runCommand: async (options: { detached: boolean; cwd: string }) => {
      assert.equal(options.detached, true)
      assert.equal(options.cwd, '/workspace')
      return {
        cmdId: 'command',
        async *logs() {
          yield { stream: 'stdout', data: 'out' }
          yield { stream: 'stderr', data: 'err' }
          yield { stream: 'stdout', data: 'put' }
        },
        wait: async () => ({ exitCode: 7 }),
        kill: async () => {},
      }
    },
  } as unknown as Sandbox
  const { sandbox } = adaptProjectSandbox(native)
  assert.deepEqual(await sandbox.run({ command: 'test' }), {
    exitCode: 7,
    stdout: 'output',
    stderr: 'err',
  })
})

test('aborting spawn kills the process and retains its UI command ID', async () => {
  let kills = 0
  const native = {
    name: 'test',
    runCommand: async () => ({
      cmdId: 'command',
      async *logs() {},
      wait: async () => ({ exitCode: 0 }),
      kill: async () => {
        kills++
      },
    }),
  } as unknown as Sandbox
  const controller = new AbortController()
  const process = await adaptProjectSandbox(native).sandbox.spawn({
    command: 'test',
    abortSignal: controller.signal,
  })
  controller.abort()
  assert.equal(kills, 1)
  assert.equal(process.commandId, 'command')
  await Promise.all([
    process.wait(),
    readOutputTail(process.stdout),
    readOutputTail(process.stderr),
  ])
})

test('command arguments remain separate literals and output tails are bounded', async () => {
  assert.equal(
    commandLine('node', ['a b', "it's.txt", '']),
    "'node' 'a b' 'it'\\''s.txt' ''"
  )
  assert.equal(
    await readOutputTail(new Response('x'.repeat(20000) + 'end').body!),
    'x'.repeat(15997) + 'end'
  )
})
