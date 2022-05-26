import { FC, ReactNode, useMemo } from 'react'
import s from './snippet.module.css'
import { highlight } from 'sugar-high'

const Snippet: FC<{ children?: ReactNode }> = ({ children }) => {
  const __html = useMemo(
    () => (children ? highlight(children.toString()!) : ''),
    [children]
  )
  return (
    <pre className={s.root}>
      <code dangerouslySetInnerHTML={{ __html }} />
    </pre>
  )
}

export default Snippet
