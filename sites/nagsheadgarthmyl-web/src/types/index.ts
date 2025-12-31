/**
 * Core type definitions for venue data.
 *
 * These types define the contract between the frontend and the Venue Manager API.
 * V1: Populated from local mock data
 * V2+: Populated from Venue Manager API
 */

// =============================================================================
// VENUE
// =============================================================================

export interface VenueInfo {
  name: string
  tagline?: string
  description: string
  address: Address
  contact: ContactInfo
  social: SocialLinks
  awards?: Award[]
}

export interface Address {
  line1: string
  line2?: string
  town: string
  county?: string
  postcode: string
  country: string
}

export interface ContactInfo {
  phone: string
  email: string
  bookingEmail?: string
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  tripadvisor?: string
}

export interface Award {
  name: string
  body: string           // e.g., "AA", "Visit Wales"
  rating?: string        // e.g., "5 stars", "Rosette"
  year?: number
}

// =============================================================================
// OPENING HOURS
// =============================================================================

export interface OpeningHours {
  regular: DayHours[]
  specialClosures?: SpecialClosure[]
}

export interface DayHours {
  day: DayOfWeek
  isClosed: boolean
  periods?: TimePeriod[]  // Multiple periods for split hours (e.g., 12-2, 6-9)
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export interface TimePeriod {
  open: string   // 24hr format: "12:00"
  close: string  // 24hr format: "14:30"
  label?: string // e.g., "Lunch", "Dinner"
}

export interface SpecialClosure {
  date: string        // ISO date: "2025-12-25"
  reason?: string     // e.g., "Christmas Day"
  isClosed: boolean
  periods?: TimePeriod[]  // If not fully closed, custom hours
}

// =============================================================================
// MENUS
// =============================================================================

export interface Menu {
  id: string
  name: string                  // "Evening Menu", "Sunday Lunch", "Mother's Day 2025"
  slug: string                  // "evening", "sunday-lunch", "mothers-day-2025"
  description?: string
  isActive: boolean             // Controlled by admin, frontend just respects this
  isEvent: boolean              // True for special occasion menus
  eventDateRange?: DateRange    // When this special menu is available (display only)
  pdfUrl?: string               // Optional PDF version
  imageUrl?: string             // Optional JPG/image version
  sections: MenuSection[]
  sortOrder: number             // Admin controls display order
}

export interface DateRange {
  start: string   // ISO date
  end: string     // ISO date
}

export interface MenuSection {
  id: string
  name: string              // "Starters", "Mains", "Desserts", "Wines"
  description?: string
  items: MenuItem[]
  sortOrder: number
}

export interface MenuItem {
  id: string
  name: string
  description?: string
  price?: number            // Optional - some menus don't show prices
  priceNote?: string        // e.g., "Market price", "From £12.95"
  dietaryTags?: DietaryTag[]
  isAvailable: boolean      // Can be marked unavailable without removing
  sortOrder: number
  variants?: MenuItemVariant[]  // Price variants (e.g., Small/Large)
}

export interface MenuItemVariant {
  id: string
  label: string             // e.g., "Small", "Large"
  price: number
  isDefault?: boolean
  isAvailable?: boolean
  sortOrder?: number
}

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'contains-nuts'
  | 'spicy'

// =============================================================================
// ACCOMMODATION
// =============================================================================

export interface Accommodation {
  description: string
  bookingUrl: string          // eviivo link
  bookingPhone?: string
  bookingEmail?: string
  features: string[]          // "Pet-friendly", "Free WiFi", etc.
  awards?: Award[]
  rooms: Room[]
}

export interface Room {
  id: string
  name: string                // "The Montgomery Suite"
  description: string
  type: RoomType
  sleeps: number
  features: string[]          // "En-suite", "King bed", "Garden view"
  images: GalleryImage[]
  isAvailable: boolean
  sortOrder: number
}

export type RoomType =
  | 'single'
  | 'double'
  | 'twin'
  | 'family'
  | 'suite'

// =============================================================================
// EXPLORE (Local Attractions)
// =============================================================================

export interface Attraction {
  id: string
  name: string                // "Powis Castle"
  description: string
  distance?: string           // "5 miles", "20 yards"
  websiteUrl?: string
  category: AttractionCategory
  image?: GalleryImage
  sortOrder: number
}

export type AttractionCategory =
  | 'heritage'
  | 'nature'
  | 'activities'
  | 'dining'
  | 'shopping'
  | 'transport'

// =============================================================================
// GALLERY
// =============================================================================

export interface GalleryImage {
  id: string
  src: string
  alt: string
  caption?: string
  category?: string           // "restaurant", "rooms", "exterior", "food"
  sortOrder: number
}

// =============================================================================
// PAGE CONTENT (for flexible sections)
// =============================================================================

export interface PageSection {
  id: string
  title?: string
  content: string             // HTML or markdown content
  image?: GalleryImage
  layout: 'text-only' | 'image-left' | 'image-right' | 'image-above'
  sortOrder: number
}

// Used for pages like Restaurant, About, Explore intro text
export interface PageContent {
  title: string
  subtitle?: string
  heroImage?: GalleryImage
  sections: PageSection[]
}
