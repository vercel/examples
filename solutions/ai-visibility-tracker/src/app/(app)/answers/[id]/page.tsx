import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Muted, PageHeader, Section, TextLink } from '@/components/blocks'
import { Markdown } from '@/components/markdown'
import { Badge } from '@/components/ui/badge'
import { getDb } from '@/lib/db'
import { fmtDateTime, fmtPosition } from '@/lib/format'
import { platformLabel } from '@/lib/platforms'
import { getAnswer } from '@/lib/queries/answers'
import { getBrand } from '@/lib/queries/brand'

export const metadata: Metadata = { title: 'Answer' }

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const answerId = Number(id)
  if (!Number.isInteger(answerId)) notFound()
  const db = await getDb()
  const brand = (await getBrand(db))!
  const detail = await getAnswer(db, brand.id, answerId)
  if (!detail) notFound()
  const { answer, question, mentions } = detail

  return (
    <>
      <PageHeader
        title={question.text}
        description={`${platformLabel(answer.platform)} · ${fmtDateTime(
          answer.completedAt ?? answer.createdAt
        )}${answer.modelId ? ` · ${answer.modelId}` : ''}`}
        actions={
          <TextLink href={`/runs/${answer.runId}`} muted>
            View check
          </TextLink>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {answer.status === 'done' ? (
          <>
            <Badge variant={answer.brandMentioned ? 'default' : 'outline'}>
              {answer.brandMentioned
                ? `${brand.name} mentioned ${answer.mentionCount}×`
                : `${brand.name} not mentioned`}
            </Badge>
            <Badge variant="outline">
              {answer.brandCited ? 'Website cited' : 'Website not cited'}
            </Badge>
            {answer.brandPosition ? (
              <Badge variant="outline">
                Position {fmtPosition(answer.brandPosition)}
              </Badge>
            ) : null}
            <Badge variant="secondary">{answer.brandsNamed} brands named</Badge>
          </>
        ) : (
          <Badge variant="secondary" className="capitalize">
            {answer.status}
          </Badge>
        )}
      </div>

      {answer.error ? (
        <Section className="mb-6" title="Error">
          <Muted>{answer.error}</Muted>
        </Section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <div className="space-y-6">
          <Section title="Answer">
            {answer.text ? (
              <Markdown>{answer.text}</Markdown>
            ) : (
              <Muted>—</Muted>
            )}
          </Section>
          {answer.searchQueries.length > 0 ? (
            <Section title="Searches the platform ran">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {answer.searchQueries.map((query) => (
                  <li key={query}>{query}</li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>

        <div className="space-y-6">
          <Section
            title="Brands in this answer"
            description="Found by the extractor; positions come from the answer text."
            flush
          >
            {mentions.length === 0 ? (
              <Muted className="px-6">No brands extracted.</Muted>
            ) : (
              <ul className="divide-y">
                {mentions.map((m) => (
                  <li key={m.id} className="px-6 py-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="num w-7 text-muted-foreground">
                        {m.position ? `#${m.position}` : '—'}
                      </span>
                      <span className="font-medium">{m.name}</span>
                      {m.isSelf ? <Badge>you</Badge> : null}
                      {!m.isSelf && !m.isCompetitor ? (
                        <Badge variant="secondary">not a competitor</Badge>
                      ) : null}
                      <Badge variant="outline">{m.sentiment}</Badge>
                      {m.recommended ? (
                        <Badge variant="outline">recommended</Badge>
                      ) : null}
                      {m.website ? (
                        <span className="text-xs text-muted-foreground">
                          {m.website}
                        </span>
                      ) : null}
                    </div>
                    {m.highlights.length > 0 ? (
                      <ul className="mt-1.5 space-y-0.5 pl-9 text-muted-foreground">
                        {m.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title={`Sources (${answer.sources.length})`} flush>
            {answer.sources.length === 0 ? (
              <Muted className="px-6">The platform returned no sources.</Muted>
            ) : (
              <ul className="divide-y">
                {answer.sources.map((source) => (
                  <li key={source.url} className="px-6 py-2.5 text-sm">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer nofollow"
                      className="break-all underline-offset-4 hover:underline"
                    >
                      {source.title ?? source.url}
                    </a>
                    {source.title ? (
                      <p className="break-all text-xs text-muted-foreground">
                        {source.url}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </>
  )
}
