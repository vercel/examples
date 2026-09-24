'use client'

import * as React from 'react'
import { Input } from '~/components/ui/input'
import { useRef, useCallback } from 'react'

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  debounceMs?: number
  onSearch?: (query: string) => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ debounceMs = 500, onSearch, onChange, ...props }, ref) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        onChange?.(e)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          onSearch?.(query)
        }, debounceMs)
      },
      [debounceMs, onChange, onSearch]
    )

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return <Input ref={ref} onChange={handleChange} {...props} />
  }
)
SearchInput.displayName = 'SearchInput'
