'use client'

import { useActionState } from 'react'
import { addQuestions, type QuestionFormState } from '@/app/actions/questions'
import { Field } from '@/components/blocks'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const initialState: QuestionFormState = { error: null, added: 0 }

export function QuestionForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const [state, action, pending] = useActionState(addQuestions, initialState)
  return (
    <form action={action} className="space-y-4">
      <Field
        label="Questions your customers ask AI"
        htmlFor="questions"
        hint="One per line. Write them the way a real person would type them into ChatGPT."
      >
        <Textarea
          id="questions"
          name="questions"
          required
          autoFocus={autoFocus}
          placeholder={
            'best project management tools for small teams\nwhich CRM integrates with Slack?'
          }
          className="min-h-36"
        />
      </Field>
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-40">
          <Field label="Check" htmlFor="cadence">
            <Select name="cadence" defaultValue="daily">
              <SelectTrigger id="cadence" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? 'Adding…' : 'Add questions'}
        </Button>
        {state.error ? (
          <p className="text-sm text-destructive">{state.error}</p>
        ) : null}
        {state.added > 0 && !state.error ? (
          <p className="text-sm text-muted-foreground">
            Added {state.added} question{state.added === 1 ? '' : 's'}.
          </p>
        ) : null}
      </div>
    </form>
  )
}
