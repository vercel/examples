import { createContext, useContext, FC, useState } from 'react'

const UiContext = createContext<{ darkMode: boolean }>({ darkMode: false })

export const UiProvider: FC<{ darkMode: boolean }> = ({
  darkMode,
  children,
}) => {
  return (
    <UiContext.Provider value={{ darkMode }}>{children}</UiContext.Provider>
  )
}

export const useDarkMode = () => {
  const context = useContext(UiContext)
  if (!context) {
    throw new Error('useDarkMode must be used within a UiProvider')
  }
  return context.darkMode
}
