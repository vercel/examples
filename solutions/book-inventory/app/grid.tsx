import { fetchFilteredBooks } from './lib/data'
import Link from 'next/link'

export default async function Grid({
  selectedAuthors,
  query,
}: {
  selectedAuthors: string[]
  query: string
}) {
  const data = await fetchFilteredBooks(selectedAuthors, query)
  return (
    <>
      <div className="grid w-full grid-cols-2 gap-6 mt-6 sm:grid-cols-3 lg:grid-cols-5">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full">
            No books found.
          </p>
        ) : (
          data.map((book) => (
            <Link
              href={`/${book.id}`}
              key={book.id}
              prefetch={true}
              className="mb-auto transition ease-in-out hover:scale-110 bg-white/10"
            >
              <div className="relative w-full aspect-[2/3]">
                {/* TODO: Use Image component */}
                <img
                  alt={book.title}
                  width="150"
                  height="150"
                  className="absolute inset-0 object-cover w-full h-full rounded-lg shadow-sm shadow-black"
                  src={book.image}
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  )
}
