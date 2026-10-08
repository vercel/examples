import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export type AnswerSource = { url: string; title: string | null }

export type QuestionCadence = 'daily' | 'weekly'
export type RunTrigger = 'manual' | 'scheduled'
export type RunStatus = 'queued' | 'running' | 'completed' | 'failed'
export type AnswerStatus = 'pending' | 'running' | 'done' | 'failed'
export type Sentiment = 'positive' | 'neutral' | 'negative'

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
}

/** The tracked brand. The app manages exactly one row. */
export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  aliases: jsonb('aliases')
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  domain: text('domain').notNull(),
  /** ISO 3166-1 alpha-2, lowercase. Null means global. */
  country: text('country'),
  /** ISO 639-1, lowercase. Null means the question's language. */
  language: text('language'),
  platforms: jsonb('platforms')
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  ...timestamps,
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
})

export const questions = pgTable(
  'questions',
  {
    id: serial('id').primaryKey(),
    brandId: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    cadence: text('cadence')
      .$type<QuestionCadence>()
      .notNull()
      .default('daily'),
    isActive: boolean('is_active').notNull().default(true),
    lastRunAt: timestamp('last_run_at', { withTimezone: true, mode: 'date' }),
    ...timestamps,
  },
  (t) => [index('questions_brand_idx').on(t.brandId)]
)

export const runs = pgTable(
  'runs',
  {
    id: serial('id').primaryKey(),
    brandId: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    trigger: text('trigger').$type<RunTrigger>().notNull(),
    status: text('status').$type<RunStatus>().notNull().default('queued'),
    totalItems: integer('total_items').notNull().default(0),
    doneItems: integer('done_items').notNull().default(0),
    failedItems: integer('failed_items').notNull().default(0),
    startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }),
    finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'date' }),
    ...timestamps,
  },
  (t) => [index('runs_brand_created_idx').on(t.brandId, t.createdAt)]
)

/** One platform answer to one question inside one run. */
export const answers = pgTable(
  'answers',
  {
    id: serial('id').primaryKey(),
    runId: integer('run_id')
      .notNull()
      .references(() => runs.id, { onDelete: 'cascade' }),
    questionId: integer('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    brandId: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    platform: text('platform').notNull(),
    modelId: text('model_id'),
    providerModelId: text('provider_model_id'),
    status: text('status').$type<AnswerStatus>().notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    text: text('text'),
    sources: jsonb('sources')
      .$type<AnswerSource[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    searchQueries: jsonb('search_queries')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    brandMentioned: boolean('brand_mentioned').notNull().default(false),
    brandCited: boolean('brand_cited').notNull().default(false),
    mentionCount: integer('mention_count').notNull().default(0),
    /** 1-based rank of the tracked brand among the brands named in the answer. */
    brandPosition: integer('brand_position'),
    /** Distinct brands (tracked brand included) found in the answer text. */
    brandsNamed: integer('brands_named').notNull().default(0),
    error: text('error'),
    inputTokens: integer('input_tokens'),
    outputTokens: integer('output_tokens'),
    durationMs: integer('duration_ms'),
    startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }),
    completedAt: timestamp('completed_at', {
      withTimezone: true,
      mode: 'date',
    }),
    ...timestamps,
  },
  (t) => [
    index('answers_run_idx').on(t.runId),
    index('answers_brand_completed_idx').on(t.brandId, t.completedAt),
    index('answers_question_idx').on(t.questionId),
  ]
)

/** A brand the extractor found in one answer (the tracked brand included, flagged isSelf). */
export const brandMentions = pgTable(
  'brand_mentions',
  {
    id: serial('id').primaryKey(),
    answerId: integer('answer_id')
      .notNull()
      .references(() => answers.id, { onDelete: 'cascade' }),
    runId: integer('run_id')
      .notNull()
      .references(() => runs.id, { onDelete: 'cascade' }),
    brandId: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    platform: text('platform').notNull(),
    name: text('name').notNull(),
    key: text('key').notNull(),
    website: text('website'),
    sentiment: text('sentiment')
      .$type<Sentiment>()
      .notNull()
      .default('neutral'),
    recommended: boolean('recommended').notNull().default(false),
    isCompetitor: boolean('is_competitor').notNull().default(true),
    isSelf: boolean('is_self').notNull().default(false),
    position: integer('position'),
    highlights: jsonb('highlights')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    ...timestamps,
  },
  (t) => [
    index('brand_mentions_brand_key_idx').on(t.brandId, t.key),
    index('brand_mentions_answer_idx').on(t.answerId),
  ]
)

export type Brand = typeof brands.$inferSelect
export type Question = typeof questions.$inferSelect
export type Run = typeof runs.$inferSelect
export type Answer = typeof answers.$inferSelect
export type BrandMention = typeof brandMentions.$inferSelect

/** App-wide settings. One row; model overrides keyed by platform id plus "extractor". */
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  models: jsonb('models')
    .$type<Record<string, string>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
})

export type Settings = typeof settings.$inferSelect
