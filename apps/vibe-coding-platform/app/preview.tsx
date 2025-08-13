'use client'

import { Preview as PreviewComponent } from '@/components/preview/preview'
import { useSandboxStore } from './state'

interface Props {
  className?: string
}

export function Preview({ className }: Props) {
  const { status, url, paths, sandboxId } = useSandboxStore()
  return (
    <PreviewComponent
      className={className}
      disabled={status === 'stopped'}
      url={url}
      paths={paths}
      sandboxId={sandboxId}
    />
  )
}
