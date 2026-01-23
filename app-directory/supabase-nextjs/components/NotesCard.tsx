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
    <>
      <div className="border border-black">
        <p>{note.title}</p>
        <p>{note.description}</p>
        <p>{note.username}</p>
        <p>{note.created_at}</p>
      </div>
    </>
  )
}
