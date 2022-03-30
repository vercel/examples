import React, { FC } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import Nav, { NavProps } from './nav'
import { Vercel } from './icons'
import { ThemeProvider, useTheme } from 'next-themes'

export interface LayoutProps extends NavProps {
  title?: string
  darkMode?: boolean
}

const Footer = () => {
  const { theme, forcedTheme } = useTheme()
  const darkMode = forcedTheme === 'dark' || theme === 'dark'
  return (
    <footer
      className={`py-10 w-full mt-auto border-t flex items-center justify-center ${
        darkMode ? 'bg-dark-accents-0' : 'bg-accents-1'
      }  z-20`}
    >
      <span className="text-white">Created by</span>
      <a
        href="https://vercel.com"
        aria-label="Vercel.com Link"
        target="_blank"
        rel="noreferrer"
        className="text-white"
      >
        <Vercel
          className="inline-block h-6 ml-3 text-primary"
          alt="Vercel.com Logo"
        />
      </a>
    </footer>
  )
}

const Layout: FC<LayoutProps> = ({
  title,
  path,
  deployButton,
  darkMode,
  children,
}) => {
  return (
    <ThemeProvider defaultTheme="light" forcedTheme={darkMode ? 'dark' : null}>
      <div
        className={`mx-auto h-screen flex flex-col ${
          darkMode ? 'bg-dark-accents-0' : 'dark-accents-0'
        }`}
      >
        {title && (
          <Head>
            <title>{title} - Vercel Examples</title>
          </Head>
        )}

        <Nav path={path} deployButton={deployButton} />

        <div
          className={`px-8 ${darkMode ? 'bg-dark-accents-0' : 'bg-accents-0'} `}
        >
          {children}
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default Layout
