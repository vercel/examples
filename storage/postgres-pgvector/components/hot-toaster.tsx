'use client'
import { Toaster } from 'react-hot-toast'

export interface HotToasterProps {}

export function HotToaster(props: HotToasterProps) {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        iconTheme: {
          primary: '#fff',
          secondary: '#000',
        },
        style: {
          background: '#222',
          color: '#fff',
        },
      }}
    />
  )
}

HotToaster.displayName = 'HotToaster'
