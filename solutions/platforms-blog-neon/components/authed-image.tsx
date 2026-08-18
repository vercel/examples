'use client'

import { useEffect, useState } from 'react'
import { isRemoteUrl } from '@/lib/images'
import { getAccessToken } from '@/lib/neon'

// Loads a dashboard cover image (a post may be a draft): fetches a presigned URL
// from /api/file with the user's token, since an <img> can't send auth itself.
// Remote URLs (seeded demo photos) are shown as-is.
export function AuthedImage({
  imageKey,
  alt = '',
  className,
}: {
  imageKey: string
  alt?: string
  className?: string
}) {
  const [src, setSrc] = useState<string | null>(
    isRemoteUrl(imageKey) ? imageKey : null
  )

  useEffect(() => {
    if (isRemoteUrl(imageKey)) {
      setSrc(imageKey)
      return
    }
    let active = true
    ;(async () => {
      const token = await getAccessToken()
      const res = await fetch(
        `/api/file?key=${encodeURIComponent(imageKey)}&format=json`,
        { headers: token ? { authorization: `Bearer ${token}` } : {} }
      )
      if (!res.ok) return
      const { url } = await res.json()
      if (active) setSrc(url)
    })()
    return () => {
      active = false
    }
  }, [imageKey])

  if (!src) return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />
}
