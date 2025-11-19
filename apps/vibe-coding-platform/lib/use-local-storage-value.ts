'use client'
import { useEffect, useState } from 'react'

export function useLocalStorageValue(key: string) {
  const storage = window?.localStorage
  const [value, setValue] = useState<string>(() => storage?.getItem(key) ?? '')

  useEffect(() => {
    if (!storage) return
    const storedValue = storage.getItem(key)
    if (storedValue !== null) {
      setValue(storedValue)
    }
  }, [key, storage])

  useEffect(() => {
    if (!storage) return
    storage.setItem(key, value)
  }, [key, value, storage])

  return [value, setValue] as const
}
