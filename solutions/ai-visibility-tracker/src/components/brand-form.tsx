'use client'

import { useActionState } from 'react'
import { saveBrand, type BrandFormState } from '@/app/actions/brand'
import { Field, cn } from '@/components/blocks'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Brand } from '@/lib/db/schema'
import { COUNTRIES, LANGUAGES } from '@/lib/markets'
import { PLATFORMS, PLATFORM_IDS, type PlatformId } from '@/lib/platforms'

export interface PlatformOption {
  id: PlatformId
  available: boolean
  reason: string | null
  modelId: string
}

const initialState: BrandFormState = { error: null, saved: false }

export function BrandForm({
  brand,
  platformOptions,
  submitLabel,
}: {
  brand: Brand | null
  platformOptions: PlatformOption[]
  submitLabel: string
}) {
  const [state, action, pending] = useActionState(saveBrand, initialState)
  const selected = new Set(
    brand?.platforms ?? ['chatgpt', 'perplexity', 'gemini']
  )

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Brand name"
          htmlFor="name"
          hint="Exactly as AI answers would write it."
        >
          <Input
            id="name"
            name="name"
            required
            maxLength={120}
            defaultValue={brand?.name ?? ''}
            placeholder="Acme"
            autoFocus={!brand}
          />
        </Field>
        <Field
          label="Website"
          htmlFor="domain"
          hint="Used to detect citations of your own pages."
        >
          <Input
            id="domain"
            name="domain"
            required
            defaultValue={brand?.domain ?? ''}
            placeholder="acme.com"
          />
        </Field>
      </div>
      <Field
        label="Other spellings"
        htmlFor="aliases"
        hint="Comma-separated. Product names or old brand names also count as mentions."
      >
        <Input
          id="aliases"
          name="aliases"
          defaultValue={brand?.aliases.join(', ') ?? ''}
          placeholder="Acme Inc, Acme Analytics"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Country"
          htmlFor="country"
          hint="Platforms answer as if searching from here."
        >
          <Select name="country" defaultValue={brand?.country ?? 'global'}>
            <SelectTrigger id="country" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="Language"
          htmlFor="language"
          hint="Leave on automatic to follow the question's language."
        >
          <Select name="language" defaultValue={brand?.language ?? 'auto'}>
            <SelectTrigger id="language" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Same as the question</SelectItem>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <fieldset>
        <legend className="text-sm font-medium">Platforms</legend>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Each question is checked on every selected platform. Three platforms
          keep costs low; add more any time.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PLATFORM_IDS.map((id) => {
            const option = platformOptions.find((o) => o.id === id)
            const available = option?.available ?? false
            return (
              <label
                key={id}
                htmlFor={`platform-${id}`}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:bg-muted/60',
                  !available && 'opacity-60'
                )}
              >
                <Checkbox
                  id={`platform-${id}`}
                  name="platforms"
                  value={id}
                  defaultChecked={selected.has(id)}
                  className="mt-0.5"
                />
                <span>
                  <span className="font-medium">{PLATFORMS[id].label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {available
                      ? PLATFORMS[id].description
                      : option?.reason ?? 'Not available'}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      {state.saved ? (
        <p className="text-sm text-muted-foreground">Saved.</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
