import { FC, HTMLAttributes, useMemo } from 'react'
import s from './snippet.module.css'
import { highlight } from 'sugar-high'

const Snippet: FC<HTMLAttributes<HTMLPreElement>> = ({
  children,
  ...props
}) => {
  const __html = useMemo(
    () => (children ? highlight(children.toString()!) : ''),
    [children]
  )
  return (
    <pre className={s.root} {...props}>
      <code dangerouslySetInnerHTML={{ __html }} />
    </pre>
  )
}

export default Snippet
