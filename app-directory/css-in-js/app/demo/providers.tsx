'use client'

import { ChakraProvider } from '@chakra-ui/react'

interface Props {
  children: React.ReactNode
}

export default function Providers({ children }: Props) {
  return <ChakraProvider>{children}</ChakraProvider>
}
