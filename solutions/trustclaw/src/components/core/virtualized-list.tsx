'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

interface VirtualizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  estimateSize?: number
  overscan?: number
  className?: string
  onEndReached?: () => void
  endReachedThreshold?: number
  footer?: ReactNode
}

export function VirtualizedList<T>({
  items,
  renderItem,
  estimateSize = 50,
  overscan = 5,
  className,
  onEndReached,
  endReachedThreshold = 200,
  footer,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)
  const hasCalledEndReached = useRef(false)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  })

  const virtualItems = virtualizer.getVirtualItems()

  // Reset the flag when items change (new page loaded)
  useEffect(() => {
    hasCalledEndReached.current = false
  }, [items.length])

  // Handle scroll to detect end reached
  useEffect(() => {
    const scrollElement = parentRef.current
    if (!scrollElement || !onEndReached) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      if (
        distanceFromBottom < endReachedThreshold &&
        !hasCalledEndReached.current
      ) {
        hasCalledEndReached.current = true
        onEndReached()
      }
    }

    scrollElement.addEventListener('scroll', handleScroll)
    // Check immediately in case list is shorter than viewport
    handleScroll()

    return () => scrollElement.removeEventListener('scroll', handleScroll)
  }, [onEndReached, endReachedThreshold])

  return (
    <div
      ref={parentRef}
      className={className}
      style={{ overflow: 'auto', contain: 'layout paint style' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index]
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {item !== undefined && renderItem(item, virtualItem.index)}
            </div>
          )
        })}
      </div>
      {footer}
    </div>
  )
}
