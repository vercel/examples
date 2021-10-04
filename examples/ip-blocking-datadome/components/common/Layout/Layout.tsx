import React, { FC } from 'react'

const Layout: FC = ({ children }) => {
  return (
    <div className="mx-auto h-screen">
      <main className="px-8 bg-accents-1">
        <div
          className="py-6 w-full"
          style={{ minHeight: 'calc(100vh - 200px)' }}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
