import { SyntaxHighlighter } from './syntax-highlighter'
import { PulseLoader } from 'react-spinners'
import useSWR from 'swr'

interface Props {
  sandboxId: string
  path: string
}

export function FileContent({ sandboxId, path }: Props) {
  const searchParams = new URLSearchParams({ path })
  const content = useSWR(
    `/api/sandboxes/${sandboxId}/files?${searchParams.toString()}`,
    async (pathname: string, init: RequestInit) => {
      const response = await fetch(pathname, init)
      const text = await response.text()
      return text
    },
    { refreshInterval: 500 }
  )

  if (content.isLoading || !content.data) {
    return (
      <div className="absolute w-full h-full flex items-center text-center">
        <div className="flex-1">
          <PulseLoader className="opacity-60" size={8} />
        </div>
      </div>
    )
  }

  return <SyntaxHighlighter path={path} code={content.data} />
}
