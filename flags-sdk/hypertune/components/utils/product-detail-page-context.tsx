'use client'

import { createContext, useContext, useMemo, useState } from 'react'

type ProductDetailPageContextType = {
  color: string
  size: string
  setColor: (color: string) => void
  setSize: (size: string) => void
}

export function useProductDetailPageContext(): ProductDetailPageContextType {
  return useContext(ProductDetailPageContext)
}

const ProductDetailPageContext = createContext<ProductDetailPageContextType>({
  color: 'Black',
  size: 'S',
  setColor: () => {},
  setSize: () => {},
})

export function ProductDetailPageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, setState] = useState({
    color: 'Black',
    size: 'S',
  })

  const context = useMemo<ProductDetailPageContextType>(
    () => ({
      color: state.color,
      size: state.size,
      setColor: (color: string) => setState({ ...state, color }),
      setSize: (size: string) => setState({ ...state, size }),
    }),
    [state]
  )

  return (
    <ProductDetailPageContext.Provider value={context}>
      {children}
    </ProductDetailPageContext.Provider>
  )
}
