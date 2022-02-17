import React from 'react'

interface Props {
  children: string
}

const Snippet: React.VFC<Props> = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

export default Snippet
