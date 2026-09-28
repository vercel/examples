import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Sandbox } from '@vercel/sandbox'
import { NextRequest } from 'next/server'
import { decodeJwt } from 'jose'
import {
  authorizeAgent,
  signProjectToken,
  signRelayToken,
  workspaceName,
} from '../lib/project-auth'
import { relayEveRequest } from '../lib/eve-proxy'
import { GET as files } from '../app/api/sandboxes/[sandboxId]/files/route'
import { GET as logs } from '../app/api/sandboxes/[sandboxId]/cmds/[cmdId]/logs/route'
import { GET as command } from '../app/api/sandboxes/[sandboxId]/cmds/[cmdId]/route'
import { cleanupWorkspace } from './helpers/cleanup-workspace'

process.env.PROJECT_SECRET =
  'test-only-project-secret-with-at-least-32-characters'
const sessionId = 'test-session'
const path = `/eve/v1/session/${sessionId}`

test('eve mutations require a short-lived server relay grant', async () => {
  const token = await signProjectToken(sessionId)
  const request = (url: string, bearer: string, method = 'POST') =>
    new Request(`https://example.test${url}`, {
      method,
      headers: { authorization: `Bearer ${bearer}` },
    })
  for (const suffix of ['', '/compact', '/cancel', '/clear', '/reset']) {
    assert.equal(await authorizeAgent(request(path + suffix, token)), null)
  }
  const grant = await signRelayToken(sessionId, path)
  assert.ok(await authorizeAgent(request(path, grant)))
  assert.equal(await authorizeAgent(request(`${path}/compact`, grant)), null)
  assert.equal(
    await authorizeAgent(request(`${path}/stream`, grant, 'GET')),
    null
  )
  assert.equal(
    await authorizeAgent(request('/eve/v1/session/other', grant)),
    null
  )
  const payload = decodeJwt(grant)
  assert.equal(payload.exp! - payload.iat!, 60)
})

test('the relay checks BotID on every mutation and forwards only approved requests', async (t) => {
  const token = await signProjectToken(sessionId)
  let botChecks = 0
  let isBot = true
  const checkBot = async () => {
    botChecks++
    return { isBot }
  }
  const upstream = t.mock.method(
    globalThis,
    'fetch',
    async (input: string | URL | Request, init?: RequestInit) => {
      const forwarded = new Request(input, init)
      assert.ok(await authorizeAgent(forwarded))
      assert.notEqual(forwarded.headers.get('authorization'), `Bearer ${token}`)
      assert.equal(await forwarded.text(), '{"message":"hello"}')
      return Response.json({ sessionId, deliveryId: 'delivery' })
    }
  )
  const request = () =>
    new Request(`https://example.test/api/agent${path}`, {
      method: 'POST',
      body: '{"message":"hello"}',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
  assert.equal((await relayEveRequest(request(), path, checkBot)).status, 403)
  assert.equal(upstream.mock.callCount(), 0)
  isBot = false
  assert.equal((await relayEveRequest(request(), path, checkBot)).status, 200)
  assert.equal((await relayEveRequest(request(), path, checkBot)).status, 200)
  assert.equal(botChecks, 3)
  assert.equal(upstream.mock.callCount(), 2)
  assert.equal(
    (await relayEveRequest(request(), '/eve/v1/session/other', checkBot))
      .status,
    403
  )
  assert.equal(upstream.mock.callCount(), 2)
})

test('the relay forwards stream cursors without requiring another BotID check', async (t) => {
  const token = await signProjectToken(sessionId)
  t.mock.method(globalThis, 'fetch', async (input: URL, init: RequestInit) => {
    assert.equal(input.search, '?startIndex=7&follow=false')
    assert.ok(await authorizeAgent(new Request(input, init)))
    return new Response('event\n', {
      headers: {
        'content-type': 'application/x-ndjson',
        'x-eve-stream-version': '1',
      },
    })
  })
  const response = await relayEveRequest(
    new Request(
      `https://example.test/api/agent${path}/stream?startIndex=7&follow=false`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    ),
    `${path}/stream`,
    async () => {
      throw new Error('Unexpected BotID check on stream')
    }
  )
  assert.equal(await response.text(), 'event\n')
  assert.equal(response.headers.get('x-eve-stream-version'), '1')
})

test('passive workspace routes do not call SDK I/O while compute is paused', async (t) => {
  const token = await signProjectToken(sessionId)
  const sandboxId = workspaceName(sessionId)
  const io = t.mock.fn(() => {
    throw new Error('Passive request attempted sandbox I/O')
  })
  t.mock.method(
    Sandbox,
    'get',
    async () =>
      ({
        status: 'stopped',
        getCommand: io,
        readFileToBuffer: io,
      }) as unknown as Sandbox
  )
  const request = new NextRequest(
    'https://example.test/api/files?path=server.cjs',
    {
      headers: { authorization: `Bearer ${token}` },
    }
  )
  const params = Promise.resolve({ sandboxId, cmdId: 'previous-command' })
  for (const route of [files, logs, command]) {
    const response = await route(request, { params })
    assert.equal(response.status, 409)
    assert.equal((await response.json()).status, 'stopped')
  }
  assert.equal(io.mock.callCount(), 0)
})

test('cleanup finds orphaned drives even when sandbox creation did not complete', async () => {
  const calls: string[] = []
  await cleanupWorkspace(sessionId, undefined, {
    sandbox: async (name) => {
      assert.equal(name, workspaceName(sessionId))
      calls.push('lookup sandbox')
      return null
    },
    drive: async (name) => {
      assert.equal(name, workspaceName(sessionId))
      calls.push('lookup drive')
      return {
        delete: async () => {
          calls.push('delete drive')
        },
      }
    },
  })
  assert.deepEqual(calls, ['lookup sandbox', 'lookup drive', 'delete drive'])
})

test('cleanup attempts both deletes after stop fails and aggregates failures', async () => {
  const calls: string[] = []
  await assert.rejects(
    cleanupWorkspace(
      sessionId,
      {
        stop: async () => {
          calls.push('stop')
          throw new Error('stop failed')
        },
        delete: async () => {
          calls.push('delete sandbox')
          throw new Error('delete failed')
        },
      },
      {
        sandbox: async () => null,
        drive: async () => ({
          delete: async () => {
            calls.push('delete drive')
          },
        }),
      }
    ),
    (error: unknown) =>
      error instanceof AggregateError && error.errors.length === 2
  )
  assert.deepEqual(calls, ['stop', 'delete sandbox', 'delete drive'])
})
