import Link from 'next/link'
import { Suspense } from 'react'
import { connection } from 'next/server'
import { Page, Text } from '@vercel/examples-ui'
import { drawRandom } from '@/lib/cards'

async function ThreeCardDraw() {
  await connection()
  const positions = ['Past', 'Present', 'Future']
  const draws = positions.map((position) => ({
    position,
    card: drawRandom(),
  }))

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {draws.map((d) => (
        <article
          className="rounded-lg border border-gray-200 p-5"
          key={d.position}
        >
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            {d.position}
          </p>
          <h2 className="my-2 text-xl font-semibold">{d.card.name}</h2>
          <p>{d.card.upright}</p>
          <p className="mt-4">
            <a href={d.card.guideUrl} target="_blank" rel="noopener">
              Full meaning →
            </a>
          </p>
        </article>
      ))}
    </div>
  )
}

export default function ReadingPage() {
  return (
    <Page className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <Text variant="h1">Three-card spread</Text>
        <Text>Past · Present · Future</Text>
      </section>

      <Suspense fallback={<p>Drawing your spread…</p>}>
        <ThreeCardDraw />
      </Suspense>

      <Link className="font-medium" href="/">
        ← Draw another single card
      </Link>
    </Page>
  )
}
