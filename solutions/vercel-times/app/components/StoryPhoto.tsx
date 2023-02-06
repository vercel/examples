import type { FC } from 'react'
import Image from 'next/image'
import { Story } from '../nytimes-api'

interface Props {
  story: Story
  caption?: boolean
}

const StoryPhoto: FC<Props> = ({ story, caption }) => {
  if (!story.multimedia) return null

  const image = story.multimedia.find(
    (media) => media.type === 'image' && media.format === 'Super Jumbo'
  )!

  return (
    <figure>
      <div className="flex h-0 relative pb-[66.6667%]">
        <Image
          src={image.url}
          fill
          sizes="(max-width: 740px) 685px, (max-width: 1070px) 625px, 522px"
          alt={image.caption}
          className="object-cover object-top"
        />
      </div>
      {caption && (
        <figcaption className="text-content-tertiary text-right text-[0.56rem] mt-1">
          <span>{image.copyright}</span>
        </figcaption>
      )}
    </figure>
  )
}

export default StoryPhoto
