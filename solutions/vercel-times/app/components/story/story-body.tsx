import type { FC } from 'react'
import Link from 'next/link'
import cn from 'clsx'
import type { Story } from '../../nytimes-api'
import { ReadMore } from '../read-more'

interface Props {
  className?: string
  story: Story
  headline?: boolean
  secondary?: boolean
  live?: boolean
  readTime?: boolean
  variant?: keyof typeof variants
}

const variants = {
  headline: 'text-[1.375rem] leading-[1.15em] font-bold',
  'right-headline': 'text-2xl leading-[1.15em] font-light',
  secondary: 'text-base leading-[1.2em] font-bold',
}

export const StoryBody: FC<Props> = ({
  className,
  story,
  live,
  variant,
  readTime,
}) => (
  <article key={story.uri} className={className}>
    {live && (
      <span className="text-red-600 uppercase text-xs font-bold mb-1 inline-block">
        LIVE
      </span>
    )}
    <h3
      className={cn(
        variants[variant!] || 'text-lg leading-[1.2em] font-bold',
        'text-content-primary font-serif'
      )}
    >
      <Link href={new URL(story.url).pathname}>{story.title}</Link>
    </h3>
    {variant !== 'secondary' && (
      <p className="text-sm text-content-secondary leading-[1.1875rem] font-serif tracking-[0.1px] mt-1">
        {story.abstract}
      </p>
    )}
    {readTime && <ReadMore />}
    {live && (
      <div className="flex flex-row items-center">
        <span className="flex text-xs space-x-4 mt-1.5 mr-1">
          See more updates
        </span>
        <span className="flex-inline bg-slate-800 px-1.5 text-white rounded-full text-xs">
          9+
        </span>
      </div>
    )}
  </article>
)
