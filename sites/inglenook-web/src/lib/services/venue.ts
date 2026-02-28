/**
 * Venue data service functions.
 *
 * Fetches from Venue Manager API with fallback to mock data.
 * Components call these functions and receive typed data.
 */

import {
  VenueInfo,
  OpeningHours,
  Menu,
  MenuImage,
  Accommodation,
  Attraction,
  GalleryResponse,
  PageContent,
} from '@/types'

import {
  mockVenueInfo,
  mockOpeningHours,
  mockMenus,
  mockAccommodation,
  mockAttractions,
  mockPageContent,
} from '@/lib/data/mock'

const API_URL = process.env.API_URL || 'http://localhost:3017'
const VENUE_ID = process.env.VENUE_ID || '1'

// Helper to call the API
async function apiCall<T>(endpoint: string, body: object): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'force-cache',
    })
    const data = await response.json()
    if (data.return_code === 'SUCCESS') {
      return data
    }
    console.error(`API error on ${endpoint}:`, data.return_code, data.message)
    return null
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error)
    return null
  }
}

// =============================================================================
// VENUE INFO
// =============================================================================

export async function getVenueInfo(): Promise<VenueInfo> {
  const data = await apiCall<{ return_code: string; venue: VenueInfo }>(
    '/api/venue/get_venue',
    { venue_id: parseInt(VENUE_ID) }
  )
  return data?.venue || mockVenueInfo
}

// =============================================================================
// OPENING HOURS
// =============================================================================

export async function getOpeningHours(): Promise<OpeningHours> {
  const data = await apiCall<{ return_code: string; hours: OpeningHours }>(
    '/api/hours/get_hours',
    { venue_id: parseInt(VENUE_ID) }
  )
  return data?.hours || mockOpeningHours
}

// =============================================================================
// MENUS
// =============================================================================

/**
 * Get all active menus (regular + events)
 */
export async function getMenus(): Promise<Menu[]> {
  const data = await apiCall<{
    return_code: string
    menus: Array<Menu & { type?: string; images?: MenuImage[] }>
  }>(
    '/api/menus/get_menus',
    { venue_id: parseInt(VENUE_ID) }
  )
  if (data?.menus) {
    return data.menus
      .map(menu => ({
        ...menu,
        isEvent: menu.type === 'event',
        images: menu.images || [],
      }))
      .filter(menu => menu.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }
  return mockMenus.filter(menu => menu.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * Get active regular menus only (non-event)
 */
export async function getRegularMenus(): Promise<Menu[]> {
  const menus = await getMenus()
  return menus.filter(menu => !menu.isEvent)
}

/**
 * Get active event/special menus only
 */
export async function getEventMenus(): Promise<Menu[]> {
  const menus = await getMenus()
  return menus.filter(menu => menu.isEvent)
}

/**
 * Get a single menu by slug
 */
export async function getMenuBySlug(slug: string): Promise<Menu | null> {
  const menus = await getMenus()
  return menus.find(m => m.slug === slug) || null
}

// =============================================================================
// ACCOMMODATION
// =============================================================================

export async function getAccommodation(): Promise<Accommodation | null> {
  const data = await apiCall<{ return_code: string; accommodation: Accommodation }>(
    '/api/accommodation/get_accommodation',
    { venue_id: parseInt(VENUE_ID) }
  )
  return data?.accommodation || mockAccommodation
}

// =============================================================================
// ATTRACTIONS (Explore)
// =============================================================================

export async function getAttractions(): Promise<Attraction[]> {
  const data = await apiCall<{ return_code: string; attractions: Attraction[] }>(
    '/api/attractions/get_attractions',
    { venue_id: parseInt(VENUE_ID) }
  )
  if (data?.attractions) {
    return data.attractions.sort((a, b) => a.sortOrder - b.sortOrder)
  }
  return mockAttractions.sort((a, b) => a.sortOrder - b.sortOrder)
}

// =============================================================================
// GALLERY
// =============================================================================

export async function getGalleryImages(limit?: number, offset?: number): Promise<GalleryResponse> {
  const body: Record<string, number> = { venue_id: parseInt(VENUE_ID) }
  if (limit != null) {
    body.limit = limit
    body.offset = offset ?? 0
  }

  const data = await apiCall<{
    return_code: string
    totalCount: number
    images: Array<{
      id: string
      imageUrl: string
      cloudinaryPublicId: string
      caption: string
      sortOrder: number
    }>
  }>('/api/gallery/get_gallery', body)

  if (data?.images && data.images.length > 0) {
    return {
      images: data.images.map((img) => ({
        id: img.id,
        src: img.imageUrl,
        alt: img.caption || 'Gallery image',
        caption: img.caption || undefined,
        sortOrder: img.sortOrder,
      })),
      totalCount: data.totalCount,
    }
  }

  return { images: [], totalCount: 0 }
}

// =============================================================================
// PAGE CONTENT
// =============================================================================

/**
 * Get content for static pages (Restaurant, About, etc.)
 */
export async function getPageContent(pageSlug: string): Promise<PageContent | null> {
  const data = await apiCall<{ return_code: string; pageContent: PageContent }>(
    '/api/pages/get_page',
    { venue_id: parseInt(VENUE_ID), page: pageSlug }
  )
  return data?.pageContent || mockPageContent[pageSlug] || null
}
