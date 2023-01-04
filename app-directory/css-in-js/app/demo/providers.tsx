'use client'

import type { FC, ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'

const Providers: FC<{ children: ReactNode }> = ({ children }) => (
  <ChakraProvider>{children}</ChakraProvider>
)

export default Providers
