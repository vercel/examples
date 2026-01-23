'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'

type CreateNotesProps = {
  createNote: (formData: FormData) => Promise<void>
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-50 shadow-sm ring-1 ring-zinc-700 hover:bg-zinc-800 hover:ring-zinc-600 disabled:opacity-60 disabled:hover:bg-zinc-900 disabled:hover:ring-zinc-700"
    >
      {pending ? 'Saving…' : 'Submit'}
    </button>
  )
}

export default function CreateNotes({ createNote }: CreateNotesProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-50 shadow-sm hover:border-zinc-700 hover:bg-zinc-900"
      >
        Create Note
      </button>

      {open && (
        <div className="mt-3 w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-xl ring-1 ring-white/10">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-50">New Note</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            >
              Close
            </button>
          </div>
          <form action={createNote} className="flex flex-col gap-3 text-xs">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-zinc-300">
                Username
              </span>
              <input
                name="username"
                type="text"
                className="h-8 rounded-md border border-zinc-800 bg-zinc-950 px-2 text-xs text-zinc-100 shadow-inner outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-zinc-300">
                Title
              </span>
              <input
                name="title"
                type="text"
                className="h-8 rounded-md border border-zinc-800 bg-zinc-950 px-2 text-xs text-zinc-100 shadow-inner outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-zinc-300">
                Description
              </span>
              <textarea
                name="description"
                className="min-h-[80px] rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 shadow-inner outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              />
            </label>
            <SubmitButton />
          </form>
        </div>
      )}
    </div>
  )
}
