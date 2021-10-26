import React, { FC } from 'react'
import Head from 'next/head'
import Nav, { NavProps } from './nav'
import { Vercel } from './icons'

export interface LayoutProps extends NavProps {
  title?: string
}

const Layout: FC<LayoutProps> = ({ title, path, deployButton, children }) => {
  return (
    <div className="mx-auto h-screen flex flex-col">
      {title && (
        <Head>
          <title>{title} - Vercel Edge Functions</title>
        </Head>
      )}

      <Nav path={path} deployButton={deployButton} />

      <div className="px-8 bg-accents-0">{children}</div>

      <footer className="py-10 w-full mt-auto border-t flex items-center justify-center bg-accents-1 z-20">
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
