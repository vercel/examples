import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ProjectEditor } from '@/components/dashboard/project-editor'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

async function getProject(id: string, userId: string) {
  return prisma.project.findFirst({
    where: {
      id,
      OR: [
        { userId },
        { isPublic: true },
      ],
    },
    include: {
      conversations: {
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
      files: {
        orderBy: { path: 'asc' },
      },
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const { id } = await params
  const project = await getProject(id, session.user.id)

  if (!project) {
    notFound()
  }

  const isOwner = project.userId === session.user.id

  return (
    <ProjectEditor
      project={project}
      isOwner={isOwner}
      currentUser={session.user}
    />
  )
}
