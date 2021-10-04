import React from 'react'
import cn from 'classnames'
import s from './Nav.module.css'
import { Button } from '@components/ui'
import Link from 'next/link'

export default function Nav({ path = 'Edge Middleware Examples' }) {
  return (
    <nav className={s.root}>
      <div className={cn(s.container, 'flex items-center lg:px-6 px-8')}>
        <div className="flex flex-row items-center">
          <span>
            <svg height="26" viewBox="0 0 75 65" fill="#000">
              <title>Vercel Logo</title>
              <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
            </svg>
          </span>
          <li className="ml-2 text-gray-200">
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              shapeRendering="geometricPrecision"
            >
              <path d="M16.88 3.549L7.12 20.451"></path>
            </svg>
          </li>
          <li className="font-medium" style={{ letterSpacing: '.01px' }}>
            <Link href="/">
              <a>{path}</a>
            </Link>
          </li>
        </div>
        <div className="flex-1 justify-end hidden md:flex">
          <nav className="flex-row inline-flex items-center">
            {/* <Link href="/calculator">
              <a className="ml-4 h-full flex items-center">Calculator</a>
            </Link>
            <span className="ml-4 h-full flex items-center cursor-not-allowed text-accents-5">
              Best Practices
            </span>
            <span className="ml-4 h-full flex items-center cursor-not-allowed text-accents-5">
              Common Problems
            </span>
            <span className="ml-4 h-full flex items-center cursor-not-allowed text-accents-5">
              Changelog
            </span> */}
            <span className="ml-2 h-full flex items-center cursor-not-allowed text-accents-5">
              <Button
                variant="ghost"
                Component="a"
                href="https://github.com/vercel-customer-feedback/edge-functions/tree/main/examples"
              >
                More Examples →
              </Button>
            </span>
            <span className="ml-2 h-full flex items-center cursor-not-allowed text-accents-5">
              <Button
                Component="a"
                href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-customer-feedback%2Fedge-middleware%2Ftree%2Fmain%2Fexamples%2Fdatadome&env=NEXT_PUBLIC_DATADOME_CLIENT_KEY,DATADOME_SERVER_KEY,DATADOME_MANAGEMENT_KEY&project-name=datadome&repo-name=datadome"
              >
                Clone & Deploy
              </Button>
            </span>
          </nav>
        </div>
      </div>
    </nav>
  )
}
