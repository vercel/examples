'use client'

import { useState, useTransition, type FormEvent } from 'react'

type CreateNotesProps = {
  createNote: (formData: FormData) => Promise<void>
}

export default function CreateNotes({ createNote }: CreateNotesProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setError(null)

    startTransition(() => {
      createNote(formData)
        .then(() => {
          form.reset()
          setOpen(false)
        })
        .catch((err: any) => {
          setError(err?.message ?? 'Something went wrong')
        })
    })
  }

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
        <div className="absolute right-0 top-full z-10 mt-3 w-80 sm:w-96 md:w-[28rem] rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-xl ring-1 ring-white/10">
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-zinc-300">
                Username
              </span>
              <input
                name="username"
                type="text"
                required
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
                required
                className="h-8 rounded-md border border-zinc-800 bg-zinc-950 px-2 text-xs text-zinc-100 shadow-inner outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-zinc-300">
                Description
              </span>
              <textarea
                name="description"
                required
                className="min-h-[80px] rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 shadow-inner outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              />
            </label>
            {error && <p className="text-[11px] text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-50 shadow-sm ring-1 ring-zinc-700 hover:bg-zinc-800 hover:ring-zinc-600 disabled:opacity-60 disabled:hover:bg-zinc-900 disabled:hover:ring-zinc-700"
            >
              {isPending ? 'Saving…' : 'Submit'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
