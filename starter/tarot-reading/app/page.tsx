import Link from 'next/link'
import { Suspense } from 'react'
import { connection } from 'next/server'
import { Page, Text } from '@vercel/examples-ui'
import { drawRandom } from '@/lib/cards'

async function RandomCard() {
  await connection()
  const card = drawRandom()

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-semibold">{card.name}</h2>
      <p>
        <strong>Upright:</strong> {card.upright}
      </p>
      <p>
        <strong>Reversed:</strong> {card.reversed}
      </p>
      <p className="mt-4">
        <a href={card.guideUrl} target="_blank" rel="noopener">
          Read the full card guide →
        </a>
      </p>
    </article>
  )
}

export default function HomePage() {
  return (
    <Page className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <Text variant="h1">Your card of the moment</Text>
        <Text>
          This request-time component draws a card while the page shell streams
          immediately.
        </Text>
      </section>

      <Suspense fallback={<p>Drawing a card…</p>}>
        <RandomCard />
      </Suspense>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Try a spread</Text>
        <Text>
          The second example draws distinct positions for a past, present, and
          future reading.
        </Text>
        <Link className="font-medium" href="/reading">
          Get a three-card reading →
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Open data</Text>
        <Text>
          Extend the sample deck with the{' '}
          <a href="https://huggingface.co/datasets/Blacik/deckaura-tarot-card-meanings">
            MIT-licensed Deckaura dataset
          </a>
          .
        </Text>
      </section>
    </Page>
  )
}
