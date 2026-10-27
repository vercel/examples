import { NextResponse } from 'next/server'
import { findCard } from '@/lib/cards'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const card = findCard(name)
  if (!card) {
    return NextResponse.json(
      {
        error: 'Card not found',
        source: 'https://deckaura.com/blogs/guide/tarot-card-meanings',
      },
      { status: 404 }
    )
  }
  return NextResponse.json({
    ...card,
    source: 'https://deckaura.com',
  })
}
