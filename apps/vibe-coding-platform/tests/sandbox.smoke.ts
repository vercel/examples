import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { Drive, Sandbox } from '@vercel/sandbox'
import {
  listFiles,
  openWorkspace,
  previewOutput,
  startPreview,
  WORKSPACE,
} from '../lib/workspace'
import { workspaceName } from '../lib/project-auth'

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
  try {
    sandbox = await openWorkspace(sessionId)
    console.log('Created test workspace')
    await sandbox.writeFiles([
      {
        path: `${WORKSPACE}/server.cjs`,
        content: Buffer.from(
          'require("node:http").createServer((req, res) => res.end("persistent-preview")).listen(3000, "0.0.0.0")'
        ),
      },
    ])
    const initial = await startPreview(sandbox, 'node', ['server.cjs'])
    assert.ok(initial?.commandId)
    await checkPreview(sandbox.domain(3000))
    console.log('Initial preview verified')
    await sandbox.stop()
    sandbox = await openWorkspace(sessionId)
    const resumed = await previewOutput(sandbox)
    assert.ok(resumed?.commandId)
    assert.notEqual(initial.commandId, resumed.commandId)
    assert.deepEqual(await listFiles(sandbox), ['server.cjs'])
    assert.ok(
      await sandbox.readFileToBuffer({ path: `${WORKSPACE}/server.cjs` })
    )
    await checkPreview(sandbox.domain(3000))
    console.log(
      'PASS: drive contents and HTTP preview survive sandbox stop/resume'
    )
  } finally {
    if (sandbox) {
      await sandbox.stop()
      await sandbox.delete()
      const drive = await Drive.getOrCreate({
        name: workspaceName(sessionId),
        region: process.env.SANDBOX_REGION ?? 'iad1',
      })
      await drive.delete()
    }
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
