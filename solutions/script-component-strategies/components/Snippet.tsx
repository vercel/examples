import type { ReactNode } from 'react'

const Snippet = ({ children }: { children: ReactNode }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

export default Snippet
