import { FC, HTMLAttributes, useMemo } from 'react'
import cn from 'clsx'
import { highlight } from 'sugar-high'
import s from './snippet.module.css'

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
    <pre className={cn(s.root, className)} {...props}>
      <code dangerouslySetInnerHTML={{ __html }} />
    </pre>
  )
}

export default Snippet
