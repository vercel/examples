'use client'

import { Search, Loader2 } from 'lucide-react'
import { SearchInput } from '~/components/core/search-input'

interface ToolkitSearchProps {
  onSearch: (query: string) => void
  isLoading?: boolean
}

export function ToolkitSearch({ onSearch, isLoading }: ToolkitSearchProps) {
  return (
    <div className="relative w-full sm:w-72">
      {isLoading ? (
        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <SearchInput
        placeholder="Search across 500+ toolkits..."
        className="pl-9"
        debounceMs={300}
        onSearch={onSearch}
      />
    </div>
  )
}
