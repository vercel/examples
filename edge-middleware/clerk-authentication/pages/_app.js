import '../styles/globals.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { ClerkProvider } from '@clerk/nextjs'

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default MyApp
