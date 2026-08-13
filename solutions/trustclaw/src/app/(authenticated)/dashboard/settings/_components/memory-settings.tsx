'use client'

import { Brain } from 'lucide-react'
import moment from 'moment'
import { trpc } from '~/clients/trpc'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

export function MemorySettings() {
  const { data, isLoading } = trpc.trustclaw.getMemories.useQuery({
    limit: 50,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory</CardTitle>
        <CardDescription>
          Things your agent has remembered across conversations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Brain className="text-muted-foreground mb-2 h-8 w-8" />
            <p className="text-muted-foreground text-sm">
              No memories yet. Your agent will remember things as you chat.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {data.items.map((memory) => (
              <li
                key={memory.id}
                className="border-border bg-card flex flex-col gap-1 rounded-md border p-3"
              >
                <p className="text-foreground text-sm">{memory.content}</p>
                <span className="text-muted-foreground text-xs">
                  {moment(memory.createdAt).fromNow()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
