import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DashboardHeader } from '@/components/dashboard/header'
import { ProjectGrid } from '@/components/dashboard/project-grid'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { Loader2 } from 'lucide-react'

async function getStats(userId: string) {
  const [projectCount, conversationCount, fileCount] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.conversation.count({
      where: { project: { userId } },
    }),
    prisma.generatedFile.count({
      where: { project: { userId } },
    }),
  ])

  return { projectCount, conversationCount, fileCount }
}

async function getRecentProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 6,
    include: {
      _count: {
        select: { conversations: true, files: true },
      },
    },
  })
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const [stats, recentProjects] = await Promise.all([
    getStats(session.user.id),
    getRecentProjects(session.user.id),
  ])

  return (
    <div className="min-h-screen bg-zinc-900">
      <DashboardHeader user={session.user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {session.user.name?.split(' ')[0] || 'Developer'}
          </h1>
          <p className="text-zinc-400 mt-1">
            Here's what's happening with your projects
          </p>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Projects */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
            <a
              href="/dashboard/projects"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all
            </a>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              </div>
            }
          >
            <ProjectGrid projects={recentProjects} />
          </Suspense>
        </section>
      </main>
    </div>
  )
}
