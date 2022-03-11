import s from './snippet.module.css'
import { highlight } from 'sugar-high'

const Snippet: React.FC = ({ children }) => {
  const __html = highlight(children?.toString()!)
  return (
    <pre className={s.root}>
      <code dangerouslySetInnerHTML={{ __html }} />
    </pre>
  )
}

export default Snippet
