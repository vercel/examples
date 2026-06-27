type Note = {
  id: string
  username: string
  title: string
  description: string
  created_at: string
}

type NotesCardProps = {
  note: Note
}

export default function NotesCard({ note }: NotesCardProps) {
  return (
    <article className="mt-3 w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-sm ring-1 ring-white/5">
      <header className="mb-2 flex items-center justify-between gap-3">
        <h3 className="truncate text-sm font-medium text-zinc-50">
          {note.title || 'Untitled Note'}
        </h3>
        <span className="shrink-0 text-[11px] text-zinc-500">
          {new Date(note.created_at).toLocaleDateString()}
        </span>
      </header>
      <div className="mb-2 text-[11px] text-zinc-400">
        <span className="font-medium text-zinc-300">@{note.username}</span>
      </div>
      <p className="text-xs leading-relaxed text-zinc-200">
        {note.description}
      </p>
    </article>
  )
}
