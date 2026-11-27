'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { trpc } from '~/clients/trpc'
import { ErrorDisplay } from '~/components/core/error-display'
import { ErrorBoundary } from '~/components/core/error-boundary'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { ToolkitCard } from './toolkit-card'
import { ToolkitSearch } from './toolkit-search'
import { ToolkitsClientSkeleton } from './toolkits-client.skeleton'

type FilterTab = 'all' | 'connected'

export function ToolkitsClient() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterTab>('all')
  const sentinelRef = useRef<HTMLDivElement>(null)

  const isConnectedFilter = filter === 'connected' ? true : undefined

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.toolkits.getToolkits.useInfiniteQuery(
    { search: search || undefined, isConnected: isConnectedFilter, limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
      refetchOnMount: 'always',
    }
  )

  // Intersection observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Event-delegated pointer tracking for glow effect
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const grid = e.currentTarget
      const cards = grid.querySelectorAll<HTMLElement>('.toolkit-card')

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const x = (e.clientX - centerX) / (rect.width / 2)
        const y = (e.clientY - centerY) / (rect.height / 2)
        card.style.setProperty('--pointer-x', x.toFixed(3))
        card.style.setProperty('--pointer-y', y.toFixed(3))
      })
    },
    []
  )

  if (isLoading) {
    return <ToolkitsClientSkeleton />
  }

  if (error && !data) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
        <h1 className="text-foreground text-xl font-bold md:text-2xl">
          Toolkits
        </h1>
        <ToolkitSearch onSearch={setSearch} />
        <ErrorDisplay
          message="Failed to load toolkits"
          retryText="Try again"
          onRetry={() => void refetch()}
        />
      </div>
    )
  }

  const allItems = data?.pages.flatMap((page) => page.items) ?? []
  const isSearching = isFetching && !isFetchingNextPage && !isLoading

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <h1 className="text-foreground text-xl font-bold md:text-2xl">
        Toolkits
      </h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filter}
          onValueChange={(v) => {
            if (v === 'all' || v === 'connected') setFilter(v)
          }}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
          </TabsList>
        </Tabs>

        <ToolkitSearch onSearch={setSearch} isLoading={isSearching} />
      </div>

      {/* Shared SVG blur filter for glow effect */}
      <svg className="sr-only" xmlns="http://www.w3.org/2000/svg">
        <filter id="toolkit-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
        </filter>
      </svg>

      <ErrorBoundary>
        {allItems.length === 0 && !isFetching ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-muted-foreground">
              {search
                ? 'No toolkits match your search'
                : filter === 'connected'
                ? 'No connected toolkits yet'
                : 'No toolkits available'}
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            onPointerMove={handlePointerMove}
          >
            {allItems.map((toolkit) => (
              <ToolkitCard key={toolkit.slug} toolkit={toolkit} />
            ))}
          </div>
        )}
      </ErrorBoundary>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <span className="text-muted-foreground text-sm">Loading more...</span>
        </div>
      )}
    </div>
  )
}
