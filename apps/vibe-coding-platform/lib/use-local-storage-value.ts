import { useEffect, useState } from 'react'

export function useLocalStorageValue(key: string) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const storedValue = localStorage.getItem(key)
    if (storedValue !== null) {
      setValue(storedValue)
    }
  }, [key])

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue] as const
}
