'use client'

import type { ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'

const Providers = ({ children }: { children: ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
)

export default Providers
