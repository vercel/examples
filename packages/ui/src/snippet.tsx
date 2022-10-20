import { FC, HTMLAttributes, useMemo } from 'react'
import cn from 'clsx'
import { highlight } from 'sugar-high'

const Snippet: FC<HTMLAttributes<HTMLPreElement>> = ({
  children,
  className,
  ...props
}) => {
  const __html = useMemo(
    () => (children ? highlight(children.toString()!) : ''),
    [children]
  )
  return (
    <pre
      className={cn(
        'border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6',
        className
      )}
      {...props}
    >
      <code dangerouslySetInnerHTML={{ __html }} />
    </pre>
  )
}

export default Snippet
