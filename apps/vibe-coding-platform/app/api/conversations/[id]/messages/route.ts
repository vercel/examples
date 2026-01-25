import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  metadata: z.record(z.any()).optional(),
})

// GET /api/conversations/[id]/messages - Get messages
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
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const cursor = searchParams.get('cursor')

    // Verify conversation access
    const conversation = await prisma.conversation.findFirst({
      where: { id },
      include: {
        project: {
          select: { userId: true, isPublic: true },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (
      conversation.project.userId !== session.user.id &&
      !conversation.project.isPublic
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
      take: limit,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    })

    return NextResponse.json({
      messages,
      nextCursor: messages.length === limit ? messages[messages.length - 1].id : null,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/conversations/[id]/messages - Add message
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
    const body = await request.json()
    const data = createMessageSchema.parse(body)

    // Verify conversation ownership
    const conversation = await prisma.conversation.findFirst({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    })

    if (!conversation || conversation.project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const message = await prisma.message.create({
      data: {
        role: data.role,
        content: data.content,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        conversationId: id,
      },
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
