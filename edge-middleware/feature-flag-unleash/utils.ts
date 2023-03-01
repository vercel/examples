import { type FC } from 'react'
import { type NextPage } from 'next'
import { type LayoutProps } from '@vercel/examples-ui/layout'

export const UNLEASH_API_PROXY_DEFINITIONS = '/api/unleash-proxy-definitions'
export const UNLEASH_COOKIE_NAME = 'unleash-session'

export type PageType<Props = {}> = NextPage<Props> & {
  Layout: FC<LayoutProps>
}
