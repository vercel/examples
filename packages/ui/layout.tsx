import React, { FC } from 'react'
import Nav from './nav'
import { Vercel } from './icons'

const Layout: FC = ({ children }) => {
  return (
    <div className="mx-auto h-screen">
      <Nav />
      <main className="px-8 bg-accents-0">
        <div
          className="w-full"
          style={{ minHeight: 'calc(100vh - 68px - 102px)' }}
        >
          {children}
        </div>
      </main>
      <footer className="py-10 w-full border-t flex items-center justify-center bg-accents-1">
        <span className="text-primary">Created by</span>
        <a
          rel="noopener noreferrer"
          href="https://vercel.com"
          aria-label="Vercel.com Link"
          target="_blank"
          className="text-black"
        >
          <Vercel
            className="inline-block h-6 ml-3 text-primary"
            alt="Vercel.com Logo"
          />
        </a>
      </footer>
    </div>
  )
}

export default Layout
