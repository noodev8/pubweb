/*
=======================================================================================================================================
API Route: menu-pdf/[id]
=======================================================================================================================================
Method: GET
Purpose: Proxies PDF files from Cloudinary to serve with correct headers for browser viewing.
         This is a file-serving endpoint, not a JSON API - returns binary PDF data on success.
=======================================================================================================================================
Request: GET /api/menu-pdf/123

Success Response: Binary PDF data with headers:
  - Content-Type: application/pdf
  - Content-Disposition: inline; filename="Menu-Name.pdf"

Error Response: Redirects to /menus page (since browser expects a file, not JSON)
=======================================================================================================================================
*/

import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:3017'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const menusPageUrl = '/menus'

  try {
    // Fetch menu data from API to get the PDF URL
    const menuResponse = await fetch(`${API_URL}/api/menus/get_menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menu_id: parseInt(id) }),
    })

    const menuData = await menuResponse.json()

    // Check if menu and PDF exist
    if (menuData.return_code !== 'SUCCESS' || !menuData.menu?.pdfUrl) {
      // Redirect to menus page - PDF not available
      return NextResponse.redirect(new URL(menusPageUrl, request.url))
    }

    const pdfUrl = menuData.menu.pdfUrl

    // Security: Only allow Cloudinary URLs
    if (!pdfUrl.includes('cloudinary.com')) {
      console.error('Invalid PDF source attempted:', pdfUrl)
      return NextResponse.redirect(new URL(menusPageUrl, request.url))
    }

    // Fetch the PDF from Cloudinary
    const pdfResponse = await fetch(pdfUrl)

    if (!pdfResponse.ok) {
      console.error('Failed to fetch PDF from Cloudinary:', pdfResponse.status)
      return NextResponse.redirect(new URL(menusPageUrl, request.url))
    }

    // Get the PDF as an ArrayBuffer
    const pdfBuffer = await pdfResponse.arrayBuffer()

    // Create safe filename from menu name
    const filename = `${menuData.menu.name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`

    // Return PDF with correct headers (HTTP 200)
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    // Log error and redirect to menus page
    console.error('Error proxying PDF:', error)
    return NextResponse.redirect(new URL(menusPageUrl, request.url))
  }
}
