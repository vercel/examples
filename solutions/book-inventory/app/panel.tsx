'use client'

import { useRouter } from 'next/navigation'
import { useOptimistic, useTransition } from 'react'

export default function Panel({
  authors,
  allAuthors,
}: {
  authors: string[]
  allAuthors: string[]
}) {
  let router = useRouter()
  let [pending, startTransition] = useTransition()
  let [optimisticAuthors, setOptimisticAuthors] = useOptimistic(authors)

  return (
    <div className="mb-auto bg-white rounded-md shadow-md dark:shadow-gray-950/30 dark:bg-white/10">
      <div
        data-pending={pending ? '' : undefined}
        className="lg:w-60 md:h-80 lg:h-[70vh] overflow-y-auto"
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold tracking-tight dark:text-gray-100">
            Authors
          </h2>

          <div className="flex px-4 pb-3 mt-4 -mx-4 overflow-x-scroll sm:px-0 sm:mx-0 sm:pb-0 sm:overflow-auto sm:flex-wrap gap-y-2 gap-x-1">
            {allAuthors.map((author) => (
              <button
                onClick={() => {
                  let newAuthors = !optimisticAuthors.includes(author)
                    ? [...optimisticAuthors, author]
                    : optimisticAuthors.filter((g) => g !== author)

                  let newParams = new URLSearchParams(
                    newAuthors.sort().map((author) => ['author', author]),
                  )

                  startTransition(() => {
                    setOptimisticAuthors(newAuthors.sort())

                    router.push(`?${newParams}`)
                  })
                }}
                key={author}
                className={`${
                  optimisticAuthors.includes(author)
                    ? 'bg-accent text-blue-500 border-blue-500'
                    : 'border-gray-500 hover:border-gray-400'
                } px-2 py-1 rounded-full whitespace-nowrap font-medium border text-xs`}
              >
                {author}
              </button>
            ))}
          </div>
        </div>
      </div>

      {optimisticAuthors.length > 0 && (
        <div className="p-1 bg-white border-t dark:border-black dark:bg-white/10">
          <div className="p-2 text-xs">
            {optimisticAuthors.map((author) => (
              <p key={author}>{author}</p>
            ))}
          </div>
          <button
            className="w-full py-2 text-sm font-medium text-center rounded dark:hover:bg-gray-600 hover:bg-black hover:text-white"
            onClick={() => {
              startTransition(() => {
                setOptimisticAuthors([])

                router.push(`/`)
              })
            }}
          >
            Clear authors
          </button>
        </div>
      )}
    </div>
  )
}
