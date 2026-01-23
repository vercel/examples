import { Page, Text, Code, Link } from '@vercel/examples-ui'
import { fetchNotes } from './queries'
import NotesCard from '../components/NotesCard'
import CreateNotes from '../components/CreateNotes'
import { createNote } from './action'

export default async function Home() {
  const notes = await fetchNotes()

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">supabase-nextjs usage example</Text>
        <Text>
          This example shows how to Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Voluptas eligendi aliquam officiis aliquid neque
          consequuntur ipsam iste, id, minima sit nulla quidem numquam, vitae
          hic quae sapiente nostrum vel ut.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Text variant="h2">Notes</Text>
          <CreateNotes createNote={createNote} />
        </div>
        {Array.isArray(notes) &&
          notes.map((note) => <NotesCard key={note.id} note={note} />)}
      </section>
    </Page>
  )
}
