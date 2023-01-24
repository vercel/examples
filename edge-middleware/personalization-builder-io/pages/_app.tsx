import type { AppProps } from 'next/app'
import { builder } from '@builder.io/react'
import builderConfig from '@config/builder'
import '@assets/index.css'
import Cookies from 'js-cookie'
import {
  initUserAttributes,
  AsyncConfigurator,
} from '@builder.io/personalization-utils/dist/browser'
// only needed for context menu styling
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'

builder.init(builderConfig.apiKey)
initUserAttributes(Cookies.get())

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <AsyncConfigurator />
    </>
  )
}
