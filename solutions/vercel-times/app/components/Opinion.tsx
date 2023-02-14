import type { FC } from 'react'
import Link from 'next/link'
import type { Story } from 'app/nytimes-api'
import { ReadMore } from './read-more'

export const Opinion: FC<{ story: Story }> = ({ story }) => (
  <div className="divide-y divide-slate-200 ">
    <article className="py-4">
      {story.kicker ? (
        <h3 className="uppercase text-[0.6875rem] text-content-quaternary font-bold font-serif mb-1">
          {story.kicker}
        </h3>
      ) : null}
      <h2 className="text-lg leading-[1.2em] tracking-[0.01em] font-medium font-serif">
        <Link href={new URL(story.url).pathname}>{story.title}</Link>
      </h2>
      <ReadMore />
    </article>
  </div>
)
