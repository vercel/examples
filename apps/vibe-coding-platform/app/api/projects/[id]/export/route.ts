import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/projects/[id]/export - Export a project as JSON
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { userId: session.user.id },
          { isPublic: true },
        ],
      },
      include: {
        files: {
          select: {
            path: true,
            content: true,
            language: true,
          },
        },
        conversations: {
          include: {
            messages: {
              select: {
                role: true,
                content: true,
                metadata: true,
                createdAt: true,
              },
            },
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Create export data
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      project: {
        name: project.name,
        description: project.description,
        template: project.template,
        tags: project.tags ? JSON.parse(project.tags) : [],
      },
      files: project.files,
      conversations: project.conversations.map((conv) => ({
        title: conv.title,
        messages: conv.messages,
      })),
    }

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${project.name.replace(/[^a-z0-9]/gi, '_')}_export.json"`,
      },
    })
  } catch (error) {
    console.error('Error exporting project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
