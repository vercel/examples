import type { Components } from 'react-markdown'
import { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
}: {
  content: string
}) {
  const components = useMemo<Components>(
    () => ({
      a: ({ children, href, ...props }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      ),
      code: ({ children, className, ...props }) => {
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          <code
            className={`${className} bg-muted px-1 py-0.5 rounded text-sm font-mono`}
            {...props}
          >
            {children}
          </code>
        ) : (
          <code
            className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        )
      },
      pre: ({ children, ...props }) => (
        <pre
          className="bg-muted p-3 rounded-sm overflow-x-auto text-sm"
          {...props}
        >
          {children}
        </pre>
      ),
      h1: ({ children, ...props }) => (
        <h1 className="text-lg font-semibold mb-2 mt-4 first:mt-0" {...props}>
          {children}
        </h1>
      ),
      h2: ({ children, ...props }) => (
        <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0" {...props}>
          {children}
        </h2>
      ),
      h3: ({ children, ...props }) => (
        <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0" {...props}>
          {children}
        </h3>
      ),
      ul: ({ children, ...props }) => (
        <ul className="list-disc pl-4 mb-2 space-y-1" {...props}>
          {children}
        </ul>
      ),
      ol: ({ children, ...props }) => (
        <ol className="list-decimal pl-4 mb-2 space-y-1" {...props}>
          {children}
        </ol>
      ),
      p: ({ children, ...props }) => (
        <p className="mb-2 last:mb-0" {...props}>
          {children}
        </p>
      ),
      blockquote: ({ children, ...props }) => (
        <blockquote
          className="border-l-4 border-muted pl-4 italic my-2"
          {...props}
        >
          {children}
        </blockquote>
      ),
    }),
    []
  )

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
})
