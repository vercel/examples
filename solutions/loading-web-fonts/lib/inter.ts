import { Inter } from '@next/font/google'

const inter = Inter({
  variable: '--inter-font',
  display: 'swap',
  // subsets to preload, more on:
  // https://nextjs.org/docs/basic-features/font-optimization#specifying-a-subset
  subsets: ['latin'],
})

export default inter
