'use client'

import { FolderKanban, MessageSquare, FileCode2, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    projectCount: number
    conversationCount: number
    fileCount: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Projects',
      value: stats.projectCount,
      icon: FolderKanban,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Conversations',
      value: stats.conversationCount,
      icon: MessageSquare,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Generated Files',
      value: stats.fileCount,
      icon: FileCode2,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'This Week',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      isPercentage: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">{card.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-lg`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
