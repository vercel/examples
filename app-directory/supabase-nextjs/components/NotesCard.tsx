export default function NotesCard(note) {
  return (
    <>
      <p>{note.title}</p>
      <p>{note.description}</p>
      <p>{note.username}</p>
    </>
  )
}
