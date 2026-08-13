import { Page, Text } from '@vercel/examples-ui'
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
          This project demonstrates how to use Supabase with Next.js App Router
          to build a simple notes web app. It uses server-side rendering for
          reading data and Next.js Server Actions for inserting new notes into a
          Supabase (Postgres) database.
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
