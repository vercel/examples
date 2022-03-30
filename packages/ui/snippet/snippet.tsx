import React from 'react'
import s from './snippet.module.css'
import { highlight } from 'sugar-high'
import { useTheme } from 'next-themes'

const Snippet: React.FC = ({ children }) => {
  const __html = React.useMemo(
    () => (children ? highlight(children.toString()!) : ''),
    [children]
  )

  const { theme, forcedTheme } = useTheme()
  const darkMode = forcedTheme === 'dark' || theme === 'dark'
  return (
    <pre className={darkMode ? s['root-dark'] : s.root}>
      <code dangerouslySetInnerHTML={{ __html }} />
    </pre>
  )
}

export default Snippet
