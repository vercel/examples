import { SyntaxHighlighter } from './syntax-highlighter'
import { PulseLoader } from 'react-spinners'
import { memo } from 'react'
import useSWR from 'swr'
import { projectFetch } from '@/lib/project-client'

interface Props {
  sandboxId: string
  path: string
}

export const FileContent = memo(function FileContent({
  sandboxId,
  path,
}: Props) {
  const searchParams = new URLSearchParams({ path })
  const content = useSWR(
    `/api/sandboxes/${sandboxId}/files?${searchParams.toString()}`,
    async (pathname: string, init: RequestInit) => {
      const response = await projectFetch(pathname, init)
      const text = await response.text()
      return text
    },
    { refreshInterval: 1000 }
  )

  if (content.error) {
    return (
      <p role="alert" className="p-4 text-sm">
        Could not load this file.
      </p>
    )
  }

  if (content.isLoading || content.data === undefined) {
    return (
      <div className="absolute w-full h-full flex items-center text-center">
        <div className="flex-1">
          <PulseLoader className="opacity-60" size={8} />
        </div>
      </div>
    )
  }

  return <SyntaxHighlighter path={path} code={content.data} />
})
