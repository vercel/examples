'use client'

import { useActionState } from 'react'
import { saveModels, type ModelsFormState } from '@/app/actions/models'
import { Field } from '@/components/blocks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  EXTRACTOR_DEFAULT_MODEL,
  EXTRACTOR_KEY,
  PLATFORMS,
  PLATFORM_IDS,
  type PlatformId,
} from '@/lib/platforms'

export interface ModelRow {
  key: PlatformId | typeof EXTRACTOR_KEY
  label: string
  description: string
  /** Value stored in the database, if any. */
  stored: string | null
  /** Value in effect right now (stored, else environment, else built-in). */
  effective: string
  available: boolean
  reason: string | null
}

const initialState: ModelsFormState = { error: null, saved: false }

export function ModelsForm({ rows }: { rows: ModelRow[] }) {
  const [state, action, pending] = useActionState(saveModels, initialState)
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        {rows.map((row) => (
          <Field
            key={row.key}
            label={row.label}
            htmlFor={`model_${row.key}`}
            hint={`${row.description} Default: ${defaultFor(row.key)}.${
              row.reason ? ` ${row.reason}` : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <Input
                id={`model_${row.key}`}
                name={`model_${row.key}`}
                defaultValue={row.stored ?? ''}
                placeholder={row.effective}
                spellCheck={false}
                autoComplete="off"
                className="font-mono text-xs"
              />
              <Badge
                variant={row.available ? 'outline' : 'secondary'}
                className="shrink-0"
              >
                {row.available ? 'Ready' : 'Unavailable'}
              </Badge>
            </div>
          </Field>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Gateway model ids look like{' '}
        <code className="font-mono">creator/model</code>; see the{' '}
        <a
          href="https://vercel.com/ai-gateway/models"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          AI Gateway model list
        </a>
        . Leave a field empty to use the default. Changes apply to the next
        check.
      </p>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      {state.saved ? (
        <p className="text-sm text-muted-foreground">Saved.</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save models'}
      </Button>
    </form>
  )
}

function defaultFor(key: ModelRow['key']): string {
  return key === EXTRACTOR_KEY
    ? EXTRACTOR_DEFAULT_MODEL
    : PLATFORMS[key].defaultModel
}

export const MODEL_ROW_ORDER: Array<PlatformId | typeof EXTRACTOR_KEY> = [
  ...PLATFORM_IDS,
  EXTRACTOR_KEY,
]
