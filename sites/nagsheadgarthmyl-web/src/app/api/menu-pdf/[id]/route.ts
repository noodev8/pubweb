import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:3017'
const VENUE_ID = process.env.VENUE_ID || '1'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Fetch menu data from API to get the PDF URL
    const menuResponse = await fetch(`${API_URL}/api/menus/get_menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menu_id: parseInt(id) }),
    })

    const menuData = await menuResponse.json()

    if (menuData.return_code !== 'SUCCESS' || !menuData.menu?.pdfUrl) {
      return NextResponse.json(
        { error: 'Menu or PDF not found' },
        { status: 404 }
      )
    }

    const pdfUrl = menuData.menu.pdfUrl

    // Validate it's a Cloudinary URL (security check)
    if (!pdfUrl.includes('cloudinary.com')) {
      return NextResponse.json(
        { error: 'Invalid PDF source' },
        { status: 400 }
      )
    }

    // Fetch the PDF from Cloudinary
    const pdfResponse = await fetch(pdfUrl)

    if (!pdfResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch PDF' },
        { status: 502 }
      )
    }

    // Get the PDF as an ArrayBuffer
    const pdfBuffer = await pdfResponse.arrayBuffer()

    // Extract filename from menu name for the download
    const filename = `${menuData.menu.name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`

    // Return with correct headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error proxying PDF:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
