import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Schema for imported project
const importSchema = z.object({
  version: z.string(),
  project: z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    template: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
  }),
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
      language: z.string().nullable().optional(),
    })
  ),
  conversations: z
    .array(
      z.object({
        title: z.string().nullable().optional(),
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
            metadata: z.string().nullable().optional(),
          })
        ),
      })
    )
    .optional(),
})

// POST /api/projects/import - Import a project from JSON
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = importSchema.parse(body)

    // Create the project
    const project = await prisma.project.create({
      data: {
        name: `${data.project.name} (Imported)`,
        description: data.project.description,
        template: data.project.template,
        tags: data.project.tags ? JSON.stringify(data.project.tags) : null,
        userId: session.user.id,
        files: {
          create: data.files.map((file) => ({
            path: file.path,
            content: file.content,
            language: file.language,
          })),
        },
        conversations: data.conversations
          ? {
              create: data.conversations.map((conv) => ({
                title: conv.title || 'Imported conversation',
                messages: {
                  create: conv.messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                    metadata: msg.metadata,
                  })),
                },
              })),
            }
          : undefined,
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

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid import format', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error importing project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
