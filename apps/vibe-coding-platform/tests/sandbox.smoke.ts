import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { Sandbox } from '@vercel/sandbox'
import {
  listFiles,
  openWorkspace,
  previewOutput,
  startPreview,
  WORKSPACE,
} from '../lib/workspace'
import { adaptProjectSandbox } from '../agent/lib/project-sandbox'
import { cleanupWorkspace } from './helpers/cleanup-workspace'
import { getRunningWorkspace } from '../lib/running-workspace'

async function checkPreview(url: string) {
  let failure: unknown
  for (let attempt = 0; attempt < 15; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
      assert.equal(await response.text(), 'persistent-preview')
      return
    } catch (error) {
      failure = error
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
  throw failure
}

async function main() {
  const sessionId = `smoke-${randomUUID()}`
  let sandbox: Sandbox | undefined
  let failure: unknown
  try {
    sandbox = await openWorkspace(sessionId)
    console.log('Created test workspace')
    const adapter = adaptProjectSandbox(sandbox).sandbox
    await adapter.writeTextFile({
      path: 'server.cjs',
      content:
        'require("node:http").createServer((req, res) => res.end("persistent-preview")).listen(3000, "0.0.0.0")',
    })
    assert.match(
      (await adapter.readTextFile({ path: 'server.cjs' }))!,
      /persistent-preview/
    )
    const result = await adapter.run({
      command: 'printf stdout; printf stderr >&2; exit 7',
    })
    assert.deepEqual(result, {
      exitCode: 7,
      stdout: 'stdout',
      stderr: 'stderr',
    })
    const initial = await startPreview(sandbox, 'node', ['server.cjs'])
    assert.ok(initial?.commandId)
    await checkPreview(sandbox.domain(3000))
    console.log('Initial preview verified')
    await sandbox.stop()
    assert.equal(await getRunningWorkspace(sandbox.name), null)
    assert.notEqual(
      (await Sandbox.get({ name: sandbox.name, resume: false })).status,
      'running'
    )
    sandbox = await openWorkspace(sessionId)
    const resumed = await previewOutput(sandbox)
    assert.ok(resumed?.commandId)
    assert.notEqual(initial.commandId, resumed.commandId)
    assert.deepEqual(await listFiles(adaptProjectSandbox(sandbox).sandbox), [
      'server.cjs',
    ])
    assert.ok(
      await sandbox.readFileToBuffer({ path: `${WORKSPACE}/server.cjs` })
    )
    await checkPreview(sandbox.domain(3000))
    console.log(
      'PASS: drive contents and HTTP preview survive sandbox stop/resume'
    )
  } catch (error) {
    failure = error
  } finally {
    try {
      await cleanupWorkspace(sessionId, sandbox)
    } catch (error) {
      throw failure
        ? new AggregateError([failure, error], 'Smoke test and cleanup failed')
        : error
    }
  }
  if (failure) throw failure
}

function reportError(error: Error) {
  console.error(error.message)
  if (error instanceof AggregateError) error.errors.forEach(reportError)
}

main().catch((error) => {
  reportError(error)
  process.exitCode = 1
})
