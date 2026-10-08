import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Renders model output as Markdown. react-markdown never emits raw HTML from
 * the source, so answers cannot inject markup; links open in a new tab and
 * carry nofollow because the URLs are platform-controlled.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="answer-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: label }) => (
            <a href={href} target="_blank" rel="noreferrer nofollow">
              {label}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
