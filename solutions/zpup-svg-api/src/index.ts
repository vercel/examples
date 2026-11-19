import { Hono, type Context } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import {
  checkScene,
  checkSceneWarnings,
  renderSpinSvg,
  renderSvg,
  ZpupValidationError,
  type Scene,
  type SpinOptions,
  type ValidationIssue,
} from '@zpup/core'

// Keep in sync with the pinned version of @zpup/core in package.json.
const ZPUP_VERSION = '0.3.1'

// Zpup scenes are small. These limits keep one request from using a lot of CPU.
const MAX_BODY_BYTES = 64 * 1024
const MAX_QUERY_SCENE_BYTES = 8 * 1024
const MAX_NODES = 400
const MAX_KEYFRAMES = 120

// Responses to GET depend only on the URL, so the CDN can cache them.
const CACHE_GET =
  'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'

class BadRequest extends Error {
  readonly issues: readonly ValidationIssue[]
  constructor(message: string, issues: readonly ValidationIssue[] = []) {
    super(message)
    this.issues = issues
  }
}

const app = new Hono()

app.use(
  '*',
  bodyLimit({
    maxSize: MAX_BODY_BYTES,
    onError: (c) =>
      c.json({ error: `Body is larger than ${MAX_BODY_BYTES} bytes.` }, 413),
  }),
)

app.get('/', (c) =>
  c.json({
    name: 'Zpup SVG API',
    zpup: ZPUP_VERSION,
    endpoints: {
      'GET /health': 'Health check.',
      'POST /render':
        'Scene JSON in the body, SVG out. Query: view=x,y,z, precision.',
      'GET /render.svg?scene=<url-encoded JSON>':
        'Same as POST /render, cached on the CDN. Use it as an <img> src.',
      'POST /spin':
        'Scene JSON in the body, an endlessly turning SVG out. Query: axis, duration, keyframes, direction.',
      'GET /spin.svg?scene=<url-encoded JSON>':
        'Same as POST /spin, cached on the CDN.',
      'POST /check':
        'Validate a scene without drawing it. Returns errors and warnings.',
    },
    docs: 'https://github.com/rxolve/zpup#readme',
  }),
)

app.get('/health', (c) => c.json({ status: 'ok', zpup: ZPUP_VERSION }))

app.post('/check', async (c) => {
  const scene = parseScene(await c.req.text())
  const issues = checkScene(scene)
  const warnings = issues.length === 0 ? checkSceneWarnings(scene) : []
  return c.json({
    valid: issues.length === 0,
    issues: issues.map(toIssue),
    warnings: warnings.map(toIssue),
  })
})

app.post('/render', async (c) =>
  svg(c, renderStill(c, parseScene(await c.req.text())), 'no-store'),
)
app.get('/render.svg', (c) =>
  svg(c, renderStill(c, sceneFromQuery(c)), CACHE_GET),
)

app.post('/spin', async (c) =>
  svg(c, renderSpin(c, parseScene(await c.req.text())), 'no-store'),
)
app.get('/spin.svg', (c) => svg(c, renderSpin(c, sceneFromQuery(c)), CACHE_GET))

app.notFound((c) =>
  c.json({ error: 'Not found. GET / lists the endpoints.' }, 404),
)

app.onError((err, c) => {
  if (err instanceof ZpupValidationError) {
    return c.json(
      { error: 'Invalid scene or options.', issues: err.issues.map(toIssue) },
      400,
      {
        'Cache-Control': 'no-store',
      },
    )
  }
  if (err instanceof BadRequest) {
    return c.json(
      { error: err.message, issues: err.issues.map(toIssue) },
      400,
      { 'Cache-Control': 'no-store' },
    )
  }
  console.error(err)
  return c.json({ error: 'Internal error.' }, 500)
})

export default app

function renderStill(c: Context, scene: Scene): string {
  const view = parseView(c.req.query('view'))
  const precision = optionalNumber(c.req.query('precision'), 'precision')
  return renderSvg(
    view ? { ...scene, rotate: view } : scene,
    precision === undefined ? {} : { precision },
  )
}

function renderSpin(c: Context, scene: Scene): string {
  const options: SpinOptions = {}
  const axis = c.req.query('axis')
  const direction = c.req.query('direction')
  const duration = optionalNumber(c.req.query('duration'), 'duration')
  const keyframes = optionalNumber(c.req.query('keyframes'), 'keyframes')
  if (axis !== undefined) options.axis = axis as SpinOptions['axis']
  if (direction !== undefined)
    options.direction = direction as SpinOptions['direction']
  if (duration !== undefined) options.duration = duration
  if (keyframes !== undefined) {
    if (keyframes > MAX_KEYFRAMES)
      throw new BadRequest(
        `keyframes is limited to ${MAX_KEYFRAMES} on this API.`,
      )
    options.keyframes = keyframes
  }
  // Zpup validates the values and reports anything wrong as a ZpupValidationError.
  return renderSpinSvg(scene, options)
}

function svg(c: Context, body: string, cacheControl: string) {
  return c.body(body, 200, {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': cacheControl,
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
  })
}

function sceneFromQuery(c: Context): Scene {
  const raw = c.req.query('scene')
  if (!raw)
    throw new BadRequest(
      'Pass the scene as URL-encoded JSON in the "scene" query parameter.',
    )
  if (raw.length > MAX_QUERY_SCENE_BYTES) {
    throw new BadRequest(
      `The scene query parameter is limited to ${MAX_QUERY_SCENE_BYTES} characters. Use POST instead.`,
    )
  }
  return parseScene(raw)
}

function parseScene(text: string): Scene {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    throw new BadRequest('The scene is not valid JSON.')
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new BadRequest(
      'The scene must be a JSON object with width, height and children.',
    )
  }
  const nodes = countNodes(value, 0)
  if (nodes > MAX_NODES)
    throw new BadRequest(
      `The scene has ${nodes} nodes; this API allows ${MAX_NODES}.`,
    )
  // Zpup checks everything else when it draws.
  return value as Scene
}

function countNodes(node: unknown, depth: number): number {
  if (depth > 32)
    throw new BadRequest('The scene is nested more than 32 levels deep.')
  const children = (node as { children?: unknown }).children
  if (!Array.isArray(children)) return 0
  let total = children.length
  for (const child of children) {
    if (typeof child === 'object' && child !== null)
      total += countNodes(child, depth + 1)
  }
  return total
}

function parseView(
  raw: string | undefined,
): { x: number; y: number; z: number } | undefined {
  if (raw === undefined) return undefined
  const parts = raw.split(',').map((p) => Number(p.trim()))
  if (
    parts.length < 1 ||
    parts.length > 3 ||
    parts.some((n) => !Number.isFinite(n))
  ) {
    throw new BadRequest(
      'view must be one to three numbers in degrees: x,y,z (for example -20,30).',
    )
  }
  const [x = 0, y = 0, z = 0] = parts
  return { x, y, z }
}

function optionalNumber(
  raw: string | undefined,
  name: string,
): number | undefined {
  if (raw === undefined) return undefined
  const n = Number(raw)
  if (!Number.isFinite(n)) throw new BadRequest(`${name} must be a number.`)
  return n
}

function toIssue(issue: ValidationIssue) {
  return {
    path: issue.path,
    message: issue.message,
    ...(issue.hint ? { hint: issue.hint } : {}),
  }
}
