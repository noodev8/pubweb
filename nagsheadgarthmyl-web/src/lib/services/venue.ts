/**
 * Venue data service functions.
 *
 * V1: Returns mock data from local files
 * V2: Will fetch from Venue Manager API
 *
 * Components call these functions and receive typed data.
 * The data source is abstracted—swap internals, not signatures.
 */

import {
  VenueInfo,
  OpeningHours,
  Menu,
  Accommodation,
  Attraction,
  GalleryImage,
  PageContent,
} from '@/types'

import {
  mockVenueInfo,
  mockOpeningHours,
  mockMenus,
  mockAccommodation,
  mockAttractions,
  mockGallery,
  mockPageContent,
} from '@/lib/data/mock'

// =============================================================================
// VENUE INFO
// =============================================================================

export async function getVenueInfo(): Promise<VenueInfo> {
  // V2: return fetch('/api/venue').then(res => res.json())
  return mockVenueInfo
}

// =============================================================================
// OPENING HOURS
// =============================================================================

export async function getOpeningHours(): Promise<OpeningHours> {
  // V2: return fetch('/api/hours', { next: { revalidate: 86400 } }).then(...)
  return mockOpeningHours
}

// =============================================================================
// MENUS
// =============================================================================

/**
 * Get all active menus (regular + events)
 */
export async function getMenus(): Promise<Menu[]> {
  // V2: return fetch('/api/menus', { next: { revalidate: 3600 } }).then(...)
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
  // V2: return fetch(`/api/menus/${slug}`).then(...)
  const menu = mockMenus.find(m => m.slug === slug && m.isActive)
  return menu || null
}

// =============================================================================
// ACCOMMODATION
// =============================================================================

export async function getAccommodation(): Promise<Accommodation | null> {
  // V2: return fetch('/api/accommodation', { next: { revalidate: 86400 } }).then(...)
  // Returns null if venue doesn't offer accommodation
  return mockAccommodation
}

// =============================================================================
// ATTRACTIONS (Explore)
// =============================================================================

export async function getAttractions(): Promise<Attraction[]> {
  // V2: return fetch('/api/attractions', { next: { revalidate: 86400 } }).then(...)
  return mockAttractions.sort((a, b) => a.sortOrder - b.sortOrder)
}

// =============================================================================
// GALLERY
// =============================================================================

export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  // V2: return fetch(`/api/gallery?category=${category}`).then(...)
  let images = mockGallery
  if (category) {
    images = images.filter(img => img.category === category)
  }
  return images.sort((a, b) => a.sortOrder - b.sortOrder)
}

// =============================================================================
// PAGE CONTENT
// =============================================================================

/**
 * Get content for static pages (Restaurant, About, etc.)
 */
export async function getPageContent(pageSlug: string): Promise<PageContent | null> {
  // V2: return fetch(`/api/pages/${pageSlug}`).then(...)
  const content = mockPageContent[pageSlug]
  return content || null
}
