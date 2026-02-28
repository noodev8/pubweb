import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:3017'
const VENUE_ID = process.env.VENUE_ID || '1'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = searchParams.get('limit')
  const offset = searchParams.get('offset')

  const body: Record<string, number> = { venue_id: parseInt(VENUE_ID) }
  if (limit != null) {
    body.limit = parseInt(limit)
    body.offset = offset ? parseInt(offset) : 0
  }

  const response = await fetch(`${API_URL}/api/gallery/get_gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (data.return_code !== 'SUCCESS') {
    return NextResponse.json({ images: [], totalCount: 0 })
  }

  const images = data.images.map((img: { id: string; imageUrl: string; caption: string; sortOrder: number }) => ({
    id: img.id,
    src: img.imageUrl,
    alt: img.caption || 'Gallery image',
    caption: img.caption || undefined,
    sortOrder: img.sortOrder,
  }))

  return NextResponse.json({ images, totalCount: data.totalCount })
}
