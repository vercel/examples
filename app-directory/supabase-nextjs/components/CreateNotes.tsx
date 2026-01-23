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
      className="mt-2 self-start border border-black bg-slate-200 px-3 py-[2px] text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] disabled:opacity-60"
    >
      {pending ? 'Saving…' : 'Submit'}
    </button>
  )
}

export default function CreateNotes({ createNote }: CreateNotesProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="border border-black bg-slate-200 px-4 py-1 text-sm shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000]"
      >
        Create Note
      </button>

      {open && (
        <div className="mt-4 inline-block border-2 border-black bg-[#f5f5f5] p-4 shadow-[4px_4px_0_0_#000]">
          <div className="-m-4 mb-3 flex items-center justify-between border-b-2 border-black bg-[#0000aa] px-2 py-1 text-xs font-bold uppercase tracking-widest text-white">
            <span>New Note</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-2 h-5 w-5 border border-white text-[10px] leading-none"
            >
              X
            </button>
          </div>
          <form action={createNote} className="flex flex-col gap-2 text-xs">
            <label className="flex flex-col gap-1">
              <span className="font-bold">Username</span>
              <input
                name="username"
                type="text"
                className="border border-black bg-white px-1 py-[2px] text-xs focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-bold">Title</span>
              <input
                name="title"
                type="text"
                className="border border-black bg-white px-1 py-[2px] text-xs focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-bold">Description</span>
              <textarea
                name="description"
                className="h-20 border border-black bg-white px-1 py-[2px] text-xs focus:outline-none"
              />
            </label>
            <SubmitButton />
          </form>
        </div>
      )}
    </div>
  )
}
