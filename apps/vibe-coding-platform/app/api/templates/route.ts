import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/templates - List all public templates
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const framework = searchParams.get('framework')
    const search = searchParams.get('search')

    const templates = await prisma.template.findMany({
      where: {
        isPublic: true,
        ...(category && { category }),
        ...(framework && { framework }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }),
      },
      orderBy: [
        { usageCount: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
