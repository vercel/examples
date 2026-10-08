/**
 * Seeds a fictional brand with questions and two weeks of synthetic answers so
 * the dashboard has something to show (public demo, local UI checks). Every
 * company, domain and statement below is invented. Never runs against a
 * database that already has a brand.
 *
 *   npm run seed:demo
 *   tsx scripts/seed-demo.ts --only-in-demo-mode   # build step: no-op unless DEMO_MODE=1
 */
import { config as loadEnv } from 'dotenv'
import { eq } from 'drizzle-orm'

loadEnv({ path: ['.env.local', '.env'], quiet: true })

const PLATFORMS = ['chatgpt', 'perplexity', 'gemini'] as const
const BRAND = {
  name: 'Northwind Analytics',
  alias: 'Northwind',
  domain: 'northwind.example',
  key: 'northwind',
}
const QUESTIONS = [
  'best analytics tools for small e-commerce teams',
  'which product analytics platform is easiest to set up?',
  'Northwind Analytics alternatives',
  'analytics tools that integrate with Shopify and Slack',
  'self-hosted product analytics software',
]
const COMPETITORS = [
  {
    name: 'Lumen Metrics',
    key: 'lumenmetrics',
    website: 'lumenmetrics.example',
    highlights: ['Enterprise product analytics', 'Weekly cohort reports'],
  },
  {
    name: 'Orbit Insights',
    key: 'orbitinsights',
    website: 'orbitinsights.example',
    highlights: ['Tracks funnels per campaign'],
  },
  {
    name: 'Beacon Data',
    key: 'beacondata',
    website: 'beacondata.example',
    highlights: ['No-code dashboards', 'Free plan for small teams'],
  },
  {
    name: 'Clearview BI',
    key: 'clearviewbi',
    website: 'clearviewbi.example',
    highlights: ['Open source and self-hostable'],
  },
]
const BRAND_HIGHLIGHT =
  'Real-time dashboards with a one-line Shopify integration'

function seeded(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

async function main(): Promise<void> {
  if (
    process.argv.includes('--only-in-demo-mode') &&
    !['1', 'true'].includes((process.env.DEMO_MODE ?? '').trim().toLowerCase())
  ) {
    return
  }
  const [{ getDb }, schema] = await Promise.all([
    import('@/lib/db'),
    import('@/lib/db/schema'),
  ])
  const db = await getDb()
  const existing = await db
    .select({ id: schema.brands.id })
    .from(schema.brands)
    .limit(1)
  if (existing.length > 0) {
    console.log(
      'A brand already exists; the demo seed only runs on an empty database.'
    )
    return
  }

  const [brand] = await db
    .insert(schema.brands)
    .values({
      name: BRAND.name,
      aliases: [BRAND.alias],
      domain: BRAND.domain,
      country: 'us',
      language: 'en',
      platforms: [...PLATFORMS],
    })
    .returning()
  const questions = await db
    .insert(schema.questions)
    .values(
      QUESTIONS.map((text, i) => ({
        brandId: brand.id,
        text,
        cadence: i < 3 ? ('daily' as const) : ('weekly' as const),
      }))
    )
    .returning()

  const random = seeded(42)
  const now = new Date()
  for (let day = 13; day >= 0; day -= 1) {
    const date = new Date(now.getTime() - day * 86_400_000)
    date.setUTCHours(6, 12, 0, 0)
    const due = questions.filter((q) => q.cadence === 'daily' || day % 7 === 0)
    const [run] = await db
      .insert(schema.runs)
      .values({
        brandId: brand.id,
        trigger: 'scheduled',
        status: 'completed',
        totalItems: due.length * PLATFORMS.length,
        startedAt: date,
        finishedAt: new Date(date.getTime() + 90_000),
        createdAt: date,
      })
      .returning()

    let done = 0
    for (const question of due) {
      for (const platform of PLATFORMS) {
        const mentioned = random() < 0.35 + (13 - day) * 0.025
        const named = COMPETITORS.filter(() => random() < 0.6)
        const order = [
          ...named.map((c) => c.name),
          ...(mentioned ? [BRAND.name] : []),
        ].sort(() => random() - 0.5)
        const text = [
          `For "${
            question.text
          }", the tools that come up most often are ${order.join(', ')}.`,
          ...order.map(
            (name) =>
              `- ${name}: ${
                name === BRAND.name
                  ? BRAND_HIGHLIGHT
                  : COMPETITORS.find((c) => c.name === name)?.highlights[0] ??
                    ''
              }.`
          ),
          mentioned && random() < 0.5
            ? `Source: https://${BRAND.domain}/docs`
            : '',
        ]
          .filter(Boolean)
          .join('\n')
        const cited = mentioned && text.includes(BRAND.domain)
        const position = mentioned ? order.indexOf(BRAND.name) + 1 : null
        const sources = [
          ...named.map((c) => ({
            url: `https://${c.website}/`,
            title: c.name,
          })),
          ...(cited
            ? [
                {
                  url: `https://${BRAND.domain}/docs`,
                  title: `${BRAND.name} docs`,
                },
              ]
            : []),
          {
            url: 'https://reviews.example/categories/product-analytics',
            title: 'Review site category',
          },
        ]
        const completedAt = new Date(date.getTime() + done * 2_000)
        const [answer] = await db
          .insert(schema.answers)
          .values({
            runId: run.id,
            questionId: question.id,
            brandId: brand.id,
            platform,
            modelId: `${platform}/demo`,
            status: 'done',
            attempts: 1,
            text,
            sources,
            searchQueries: [question.text],
            brandMentioned: mentioned,
            brandCited: cited,
            mentionCount: mentioned ? 2 : 0,
            brandPosition: position,
            brandsNamed: order.length,
            inputTokens: 900,
            outputTokens: 240,
            durationMs: 8_000 + Math.round(random() * 9_000),
            startedAt: completedAt,
            completedAt,
            createdAt: completedAt,
          })
          .returning({ id: schema.answers.id })

        const rows = order.map((name, index) => {
          const competitor = COMPETITORS.find((c) => c.name === name)
          const isSelf = name === BRAND.name
          const roll = random()
          return {
            answerId: answer.id,
            runId: run.id,
            brandId: brand.id,
            platform,
            name,
            key: isSelf ? BRAND.key : competitor!.key,
            website: isSelf ? BRAND.domain : competitor!.website,
            sentiment: (roll < 0.6
              ? 'positive'
              : roll < 0.9
              ? 'neutral'
              : 'negative') as 'positive' | 'neutral' | 'negative',
            recommended: index === 0,
            isCompetitor: !isSelf,
            isSelf,
            position: index + 1,
            highlights: isSelf ? [BRAND_HIGHLIGHT] : competitor!.highlights,
            createdAt: completedAt,
          }
        })
        if (rows.length > 0) await db.insert(schema.brandMentions).values(rows)
        done += 1
      }
      await db
        .update(schema.questions)
        .set({ lastRunAt: date })
        .where(eq(schema.questions.id, question.id))
    }
    await db
      .update(schema.runs)
      .set({ doneItems: done })
      .where(eq(schema.runs.id, run.id))
  }
  console.log(
    `Seeded brand "${brand.name}" with ${questions.length} questions and 14 days of answers.`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
