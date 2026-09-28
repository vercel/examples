import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  authorizeAgent,
  authorizeWorkspace,
  signProjectToken,
  workspaceName,
} from '../lib/project-auth'
import { projectPath } from '../lib/workspace'
import { useSandboxStore } from '../app/state'

process.env.PROJECT_SECRET =
  'test-only-project-secret-with-at-least-32-characters'

test('a project credential only opens its own session and workspace', async () => {
  const token = await signProjectToken('session-a')
  const request = (path: string) =>
    new Request(`https://example.test${path}`, {
      headers: { authorization: `Bearer ${token}` },
    })
  assert.ok(await authorizeAgent(request('/eve/v1/session/session-a/stream')))
  assert.equal(
    await authorizeAgent(request('/eve/v1/session/session-b/stream')),
    null
  )
  assert.equal(await authorizeAgent(request('/eve/v1/session')), null)
  assert.equal(
    await authorizeWorkspace(request('/'), workspaceName('session-a')),
    true
  )
  assert.equal(
    await authorizeWorkspace(request('/'), workspaceName('session-b')),
    false
  )
  assert.equal(
    await authorizeAgent(
      new Request('https://example.test/eve/v1/session/session-a/stream')
    ),
    null
  )
})

test('the server bootstrap grant can create a session but cannot read one', async () => {
  const token = await signProjectToken()
  const headers = { authorization: `Bearer ${token}` }
  assert.ok(
    await authorizeAgent(
      new Request('https://example.test/eve/v1/session', {
        method: 'POST',
        headers,
      })
    )
  )
  assert.equal(
    await authorizeAgent(
      new Request('https://example.test/eve/v1/session/other/stream', {
        headers,
      })
    ),
    null
  )
  assert.equal(
    await authorizeWorkspace(
      new Request('https://example.test/', { headers }),
      workspaceName('other')
    ),
    false
  )
})

test('project paths remain inside the mounted drive', () => {
  assert.equal(projectPath('app/page.tsx'), '/workspace/app/page.tsx')
  assert.equal(
    projectPath('/workspace/package.json'),
    '/workspace/package.json'
  )
  for (const path of [
    '../outside',
    '/etc/passwd',
    '',
    '/workspace',
    'bad\0path',
  ]) {
    assert.throws(() => projectPath(path))
  }
})

test('replaying tool outputs preserves logs and does not duplicate commands or files', () => {
  const store = useSandboxStore.getState()
  store.reset()
  const output = {
    sandboxId: 'project',
    commandId: 'command',
    command: 'pnpm',
    args: ['install'],
    paths: ['package.json'],
    status: 'executing',
  }
  store.applyToolOutput(output)
  store.addLog({
    sandboxId: 'project',
    cmdId: 'command',
    log: { stream: 'stdout', data: 'done', timestamp: 1 },
  })
  store.applyToolOutput({ ...output, status: 'done', exitCode: 0 })
  store.applyToolOutput(output)
  const state = useSandboxStore.getState()
  assert.deepEqual(state.paths, ['package.json'])
  assert.equal(state.commands.length, 1)
  assert.equal(state.commands[0].exitCode, 0)
  assert.equal(state.commands[0].logs?.length, 1)
})

test('opening or resuming a workspace replaces a stale file listing', () => {
  const store = useSandboxStore.getState()
  store.reset()
  store.applyToolOutput({
    sandboxId: 'project',
    paths: ['deleted.ts', 'keep.ts'],
  })
  store.applyToolOutput({
    sandboxId: 'project',
    paths: ['keep.ts'],
    replacePaths: true,
  })
  store.applyToolOutput({ sandboxId: 'project', paths: ['new.ts'] })
  assert.deepEqual(useSandboxStore.getState().paths, ['keep.ts', 'new.ts'])
})
