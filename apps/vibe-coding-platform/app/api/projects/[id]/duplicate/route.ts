import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST /api/projects/[id]/duplicate - Duplicate a project
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get the original project
    const originalProject = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          { isPublic: true },
        ],
      },
      include: {
        files: true,
        conversations: {
          include: {
            messages: true,
          },
        },
      },
    })

    if (!originalProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Create the duplicate project
    const duplicatedProject = await prisma.project.create({
      data: {
        name: `${originalProject.name} (Copy)`,
        description: originalProject.description,
        template: originalProject.template,
        tags: originalProject.tags,
        userId: session.user.id,
        files: {
          create: originalProject.files.map((file) => ({
            path: file.path,
            content: file.content,
            language: file.language,
          })),
        },
      },
      include: {
        files: true,
      },
    })

    return NextResponse.json({ project: duplicatedProject }, { status: 201 })
  } catch (error) {
    console.error('Error duplicating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
