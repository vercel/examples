'use client'

import { AuthedImage } from '@/components/authed-image'
import { imageSrc } from '@/lib/images'

export function AuthorByline({
  name,
  imageKey,
  imageAlt,
  authed = false,
  className = 'text-sm text-gray-500',
}: {
  name: string
  imageKey?: string | null
  imageAlt?: string | null
  authed?: boolean
  className?: string
}) {
  const photoClass = 'h-8 w-8 rounded-full object-cover shrink-0'
  const alt = imageAlt || name
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {imageKey &&
        (authed ? (
          <AuthedImage imageKey={imageKey} alt={alt} className={photoClass} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc(imageKey)} alt={alt} className={photoClass} />
        ))}
      <span>By {name}</span>
    </div>
  )
}
