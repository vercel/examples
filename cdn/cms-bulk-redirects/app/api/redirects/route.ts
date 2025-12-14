import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'generated-redirects.json')
    const contents = readFileSync(filePath, 'utf-8')
    return new NextResponse(contents, {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Redirect file not found' }, { status: 500 })
  }
}
