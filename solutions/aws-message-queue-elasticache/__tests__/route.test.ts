import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockClient = {
  xadd: vi.fn(),
  xautoclaim: vi.fn(),
  xreadgroup: vi.fn(),
  xack: vi.fn(),
  customCommand: vi.fn().mockResolvedValue('OK'),
}

vi.mock('@valkey/valkey-glide', () => ({
  GlideClient: {
    createClient: vi.fn().mockResolvedValue(mockClient),
  },
}))

process.env.VALKEY_ENDPOINT = 'localhost:6379'

const { POST, GET, DELETE } = await import('../app/api/messages/route')

beforeEach(() => {
  mockClient.xadd.mockReset()
  mockClient.xautoclaim.mockReset()
  mockClient.xreadgroup.mockReset()
  mockClient.xack.mockReset()
  mockClient.customCommand.mockResolvedValue('OK')
})

describe('POST /api/messages', () => {
  it('returns 201 with streamMessageId on valid input', async () => {
    mockClient.xadd.mockResolvedValue('1234567890-0')

    const request = new Request('http://localhost/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice', email: 'alice@test.com', message: 'Hello' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.streamMessageId).toBe('1234567890-0')
    expect(data.timestamp).toBeDefined()
  })

  it('returns 400 on missing fields', async () => {
    const request = new Request('http://localhost/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('returns 400 on oversized name', async () => {
    const request = new Request('http://localhost/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'x'.repeat(201), email: 'a@b.com', message: 'hi' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('200')
  })

  it('returns 500 without leaking error details', async () => {
    mockClient.xadd.mockRejectedValue(new Error('Connection refused to secret-host.internal:6379'))

    const request = new Request('http://localhost/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A', email: 'a@b.com', message: 'hi' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to produce message')
    expect(data.error).not.toContain('secret-host')
  })
})

describe('GET /api/messages', () => {
  it('returns claimed message from xautoclaim', async () => {
    mockClient.xautoclaim.mockResolvedValue([
      '0-0',
      { '111-0': [['name', 'Bob'], ['email', 'bob@test.com'], ['message', 'Hi'], ['timestamp', '2024-01-01T00:00:00Z']] },
      [],
    ])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message.name).toBe('Bob')
    expect(data.message.claimed).toBe(true)
    expect(data.message.streamMessageId).toBe('111-0')
  })

  it('falls back to xreadgroup when no claimed messages', async () => {
    mockClient.xautoclaim.mockResolvedValue(['0-0', {}, []])
    mockClient.xreadgroup.mockResolvedValue([
      { key: 'contact-messages', value: { '222-0': [['name', 'Carol'], ['email', 'c@t.com'], ['message', 'Hey'], ['timestamp', '2024-01-01']] } },
    ])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message.name).toBe('Carol')
    expect(data.message.claimed).toBeUndefined()
  })

  it('returns null when queue is empty', async () => {
    mockClient.xautoclaim.mockResolvedValue(['0-0', {}, []])
    mockClient.xreadgroup.mockResolvedValue([])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBeNull()
  })
})

describe('DELETE /api/messages', () => {
  it('acknowledges message successfully', async () => {
    mockClient.xack.mockResolvedValue(1)

    const request = new Request('http://localhost/api/messages?messageId=111-0', {
      method: 'DELETE',
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockClient.xack).toHaveBeenCalledWith('contact-messages', 'contact-processors', ['111-0'])
  })

  it('returns 400 when messageId is missing', async () => {
    const request = new Request('http://localhost/api/messages', {
      method: 'DELETE',
    })

    const response = await DELETE(request)
    expect(response.status).toBe(400)
  })
})
