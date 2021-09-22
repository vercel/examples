import type { AppProps } from 'next/app'
import 'tailwindcss/tailwind.css'
import '../styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
