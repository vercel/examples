import React from 'react'
import cn from 'clsx'
import Link from '../link'
import Button from '../button'
import DeployButton, { DeployButtonProps } from '../deploy-button'
import s from './nav.module.css'

const REPO_URL = 'https://github.com/vercel/examples'
const REPO_DIR = '/tree/main/'

export interface NavProps {
  path: string
  deployButton?: Partial<DeployButtonProps>
  title?: string
}

export interface BreadCrumb {
  name: string
  url?: string
}

export default function Nav({ path, deployButton, title }: NavProps) {
  const displayPath = path?.split('/').filter(Boolean) || []
  const breadCrumbs: BreadCrumb[] = []

  for (let i = 0; i < displayPath.length; i++) {
    const elementPath = displayPath.slice(0, i + 1).join('/')
    breadCrumbs.push({
      name: displayPath[i],
      url: `https://github.com/vercel/examples/tree/main/${elementPath}`,
    })
  }
  const lastElement: BreadCrumb = { name: title || '', url: '/' }
  breadCrumbs.push(lastElement)

  return (
    <nav className={s.root}>
      <div className={cn('flex items-center lg:px-6 px-8', s.container)}>
        <div className="flex flex-row items-center">
          <Link href="/">
            <span>
              <svg height="26" viewBox="0 0 75 65" fill="#000">
                <title>Vercel Logo</title>
                <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
              </svg>
            </span>
          </Link>
          <ul className="flex items-center content-center">
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
              Vercel Examples
              {breadCrumbs.map((navItem) => (
                <span key={navItem.name}>
                  {' '}
                  /{' '}
                  {navItem.url ? (
                    <Link href={navItem.url} className={s.link}>
                      {navItem.name}
                    </Link>
                  ) : (
                    navItem.name
                  )}
                </span>
              ))}
            </li>
          </ul>
        </div>
        <div className="flex-1 justify-end hidden md:flex">
          <nav className="flex-row inline-flex items-center">
            <span className="ml-2 h-full flex items-center cursor-not-allowed text-accents-5">
              <Button
                variant="ghost"
                Component="a"
                href="https://github.com/vercel/examples/tree/main"
              >
                More Examples →
              </Button>
            </span>
            <span className="ml-2 h-full flex items-center cursor-not-allowed text-accents-5">
              <DeployButton
                {...deployButton}
                repositoryUrl={
                  deployButton?.repositoryUrl ||
                  `${REPO_URL}${REPO_DIR}/${path}`
                }
                projectName={deployButton?.projectName || path}
                repositoryName={deployButton?.repositoryName || path}
              />
            </span>
          </nav>
        </div>
      </div>
    </nav>
  )
}
