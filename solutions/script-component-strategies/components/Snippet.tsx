import type { VFC, ReactChild } from 'react'

const Snippet: VFC<{ children: ReactChild }> = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

export default Snippet
