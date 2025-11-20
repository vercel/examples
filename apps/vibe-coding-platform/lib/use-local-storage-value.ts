'use client'
import { useMemo } from 'react'

export function useLocalStorageValue(
  key: string
): [string, (value: string) => void] {
  return useMemo(() => {
    return [
      localStorage.getItem(key) as string,
      (value: string) => localStorage.setItem(key, value),
    ]
  }, [key])
}
