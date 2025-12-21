# Venue Manager - Project Brief

## Context

This document provides everything needed to start building the **Venue Manager** - an admin tool for hospitality venues (pubs, inns, restaurants) to manage their own website content.

### The Bigger Picture

We're building a modern alternative to WordPress for pubs. The system has two parts:

1. **Public Website** (COMPLETE) - Next.js frontend for each venue
   - Located at: `nagsheadgarthmyl-web/`
   - Currently uses mock data
   - Ready to consume API when available

2. **Venue Manager** (THIS PROJECT) - Admin tool for venue owners
   - Self-service content management
   - No developer needed for day-to-day updates
   - Future: serves multiple venues

### Business Value

> "Your site, but faster—and you control your own menus and hours"

Target customers are pubs currently paying agencies to update their WordPress sites. They want:
- Update menus themselves (including seasonal/event menus)
- Change opening hours instantly
- Add events and special offers
- No waiting for agency, no ongoing fees

---

## What the Venue Manager Must Do

### Core Features (MVP)

1. **Venue Info Management**
   - Name, description, tagline
   - Address and contact details
   - Social media links
   - Awards/accreditations

2. **Opening Hours**
   - Regular weekly hours (with multiple periods per day)
   - Special closures (Christmas, holidays, private events)
   - Seasonal variations

3. **Menu Management** (PRIORITY)
   - Create/edit menus (Lunch, Evening, Sunday, Events)
   - Organize into sections (Starters, Mains, Desserts)
   - Add/edit items with prices, descriptions, dietary tags
   - Toggle availability (86'd items)
   - Upload menu PDFs
   - Event menus with date ranges

4. **Accommodation** (if venue offers it)
   - Room listings with descriptions, features, capacity
   - Booking URL (links to external system like eviivo)
   - Toggle room availability

5. **Attractions/Explore**
   - Local attractions for the "Explore" page
   - Categories, distances, descriptions, website links

6. **Page Content**
   - Editable sections for About, Restaurant, etc.
   - Title, subtitle, body content
   - Section ordering

### Future Features (Not MVP)

- Image uploads and gallery management
- Pre-ordering system for food
- Table reservations
- Multi-venue support (single login, multiple properties)
- Staff accounts with role-based permissions

---

## The API Contract

The public website already has TypeScript types defined. The Venue Manager API **must** produce data matching these types exactly.

### Types (from `nagsheadgarthmyl-web/src/types/index.ts`)

```typescript
// Venue Information
export interface VenueInfo {
  id: string
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
  body: string
  rating?: string
  year?: number
}

// Opening Hours
export interface OpeningHours {
  regular: DayHours[]
  specialClosures?: SpecialClosure[]
}

export interface DayHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  isClosed: boolean
  periods?: { open: string; close: string }[]
}

export interface SpecialClosure {
  date: string
  reason?: string
  isClosed: boolean
  periods?: { open: string; close: string }[]
}

// Menus
export interface Menu {
  id: string
  name: string
  slug: string
  description?: string
  type: 'regular' | 'event' | 'drinks'
  isActive: boolean
  sortOrder: number
  sections: MenuSection[]
  pdfUrl?: string
  imageUrl?: string
  eventDateRange?: {
    start: string
    end: string
  }
}

export interface MenuSection {
  id: string
  name: string
  description?: string
  sortOrder: number
  items: MenuItem[]
}

export interface MenuItem {
  id: string
  name: string
  description?: string
  price?: number
  priceNote?: string
  dietaryTags?: DietaryTag[]
  isAvailable: boolean
  sortOrder: number
}

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'contains-nuts'
  | 'spicy'

// Accommodation
export interface Accommodation {
  id: string
  description: string
  features: string[]
  bookingUrl?: string
  bookingEmail?: string
  awards?: Award[]
  rooms: Room[]
}

export interface Room {
  id: string
  name: string
  slug: string
  description: string
  type: 'single' | 'double' | 'twin' | 'suite' | 'family'
  sleeps: number
  features: string[]
  images?: string[]
  price?: {
    from: number
    currency: string
  }
  isAvailable: boolean
  sortOrder: number
}

// Attractions
export interface Attraction {
  id: string
  name: string
  description: string
  category: AttractionCategory
  distance?: string
  websiteUrl?: string
  image?: string
}

export type AttractionCategory =
  | 'heritage'
  | 'nature'
  | 'activities'
  | 'dining'
  | 'shopping'
  | 'transport'

// Gallery
export interface GalleryImage {
  id: string
  url: string
  alt: string
  caption?: string
  category?: string
  sortOrder: number
}

// Page Content
export interface PageContent {
  id: string
  page: string
  title?: string
  subtitle?: string
  sections: PageSection[]
}

export interface PageSection {
  id: string
  title?: string
  content: string
  image?: string
  layout?: 'text-only' | 'image-left' | 'image-right'
  sortOrder: number
}
```

---

## Technical Architecture

### Tech Stack (per API-Rules.md)

**Frontend (Admin UI)**
- Next.js (App Router)
- React, TypeScript
- Tailwind CSS
- Shadcn/UI components (professional admin feel, accessible)

**Backend/API**
- Node.js + Express.js (separate from frontend)
- Follow patterns in `docs/API-Rules.md`

**Database**
- PostgreSQL (direct queries, no ORM)
- Central database pooling via `/database.js`
- Use JOINs, avoid N+1 queries

**Authentication**
- JWT tokens
- Store only `App_user` ID in token
- Use `verifyToken` middleware for protected routes

**File Storage** (for PDFs, images)
- Cloudinary, Uploadthing, or S3-compatible

### API Response Pattern (per API-Rules.md)

**All responses return HTTP 200** with a `return_code` field:

```json
// Success
{
  "return_code": "SUCCESS",
  "menu": { ... }
}

// Error
{
  "return_code": "MENU_NOT_FOUND",
  "message": "Menu with that ID does not exist"
}
```

Standard return codes: `SUCCESS`, `MISSING_FIELDS`, `INVALID_*`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`, `SERVER_ERROR`

### API Endpoints (Suggested)

```
POST   /api/venue/get_venue          → VenueInfo
POST   /api/venue/update_venue       → Update venue info

POST   /api/hours/get_hours          → OpeningHours
POST   /api/hours/update_hours       → Update hours

POST   /api/menus/get_menus          → Menu[]
POST   /api/menus/create_menu        → Create menu
POST   /api/menus/get_menu           → Menu (by id)
POST   /api/menus/update_menu        → Update menu
POST   /api/menus/delete_menu        → Delete menu

POST   /api/sections/create_section  → Create section
POST   /api/sections/update_section  → Update section
POST   /api/sections/delete_section  → Delete section

POST   /api/items/create_item        → Create item
POST   /api/items/update_item        → Update item
POST   /api/items/delete_item        → Delete item
POST   /api/items/toggle_availability → Quick 86 toggle

POST   /api/accommodation/get        → Accommodation
POST   /api/accommodation/update     → Update accommodation
POST   /api/rooms/create_room        → Create room
POST   /api/rooms/update_room        → Update room
POST   /api/rooms/delete_room        → Delete room

POST   /api/attractions/get_attractions → Attraction[]
POST   /api/attractions/create       → Create attraction
POST   /api/attractions/update       → Update
POST   /api/attractions/delete       → Delete

POST   /api/pages/get_page           → PageContent (by slug)
POST   /api/pages/update_page        → Update page content
```

### API Route File Structure

Each route file must have a header comment (per API-Rules.md):

```javascript
/*
=======================================================================
API Route: get_menus
=======================================================================
Method: POST
Purpose: Returns all menus for a venue with their sections and items.
=======================================================================
Request Payload:
{
  "venue_id": "nags-head"           // string, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "menus": [
    {
      "id": "lunch-menu",
      "name": "Lunch Menu",
      ...
    }
  ]
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"VENUE_NOT_FOUND"
"SERVER_ERROR"
=======================================================================
*/
```

### Multi-Venue Consideration

For V1, assume single venue. But design database with `venueId` foreign key on all tables so multi-venue is a simple addition later.

```
venues
  └── menus
       └── sections
            └── items
  └── rooms
  └── attractions
  └── pages
  └── hours
```

---

## UI/UX Guidance

### Admin Layout
- Sidebar navigation (Venue, Hours, Menus, Rooms, Attractions, Pages)
- Clean, professional look (not flashy)
- Mobile-responsive but desktop-first (admins typically use desktop)

### Key Interactions

**Menu Editing**
- Drag-and-drop reordering for sections and items
- Inline editing where possible
- Quick "86" toggle button for items
- Batch actions (e.g., mark multiple items unavailable)

**Hours Management**
- Visual week view
- Easy "copy to other days" function
- Special closures calendar

**Validation**
- Client-side validation with helpful errors
- Prevent data loss (warn on unsaved changes)

---

## Connecting to Public Website

The public website (`nagsheadgarthmyl-web`) currently imports from mock data:

```typescript
// nagsheadgarthmyl-web/src/lib/services/venue.ts
import { mockVenueInfo, mockOpeningHours, ... } from '../data/mock'

export async function getVenueInfo(): Promise<VenueInfo> {
  // V1: Mock data
  return mockVenueInfo

  // V2: Replace with API call
  // return fetch(`${API_URL}/venue`).then(r => r.json())
}
```

When Venue Manager API is ready:
1. Add `VENUE_API_URL` environment variable to public site
2. Update service functions to fetch from API
3. Use Next.js revalidation for caching (1hr menus, 24hr venue info)

---

## Database Schema (PostgreSQL)

```sql
-- Venues
CREATE TABLE venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255),
  description TEXT,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  town VARCHAR(100) NOT NULL,
  county VARCHAR(100),
  postcode VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'United Kingdom',
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  booking_email VARCHAR(255),
  facebook VARCHAR(255),
  instagram VARCHAR(255),
  twitter VARCHAR(255),
  tripadvisor VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Awards (for venues and accommodation)
CREATE TABLE awards (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  body VARCHAR(100) NOT NULL,
  rating VARCHAR(50),
  year INTEGER,
  entity_type VARCHAR(50) DEFAULT 'venue' -- 'venue' or 'accommodation'
);

-- Opening Hours
CREATE TABLE opening_hours (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  day VARCHAR(10) NOT NULL, -- monday, tuesday, etc.
  is_closed BOOLEAN DEFAULT FALSE,
  periods JSONB -- [{"open": "12:00", "close": "15:00"}, {"open": "18:00", "close": "23:00"}]
);

-- Special Closures
CREATE TABLE special_closures (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  reason VARCHAR(255),
  is_closed BOOLEAN DEFAULT TRUE,
  periods JSONB -- override periods if not fully closed
);

-- Menus
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'regular', -- regular, event, drinks
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  pdf_url VARCHAR(500),
  image_url VARCHAR(500),
  event_start DATE,
  event_end DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(venue_id, slug)
);

-- Menu Sections
CREATE TABLE menu_sections (
  id SERIAL PRIMARY KEY,
  menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Menu Items
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES menu_sections(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  price_note VARCHAR(100),
  dietary_tags TEXT[], -- PostgreSQL array: {'vegetarian', 'gluten-free'}
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- Accommodation
CREATE TABLE accommodation (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE UNIQUE,
  description TEXT,
  features TEXT[], -- PostgreSQL array
  booking_url VARCHAR(500),
  booking_email VARCHAR(255)
);

-- Rooms
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- single, double, twin, suite, family
  sleeps INTEGER NOT NULL,
  features TEXT[],
  images TEXT[],
  price_from DECIMAL(10,2),
  price_currency VARCHAR(10) DEFAULT 'GBP',
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(venue_id, slug)
);

-- Attractions
CREATE TABLE attractions (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- heritage, nature, activities, dining, shopping, transport
  distance VARCHAR(50),
  website_url VARCHAR(500),
  image VARCHAR(500)
);

-- Page Content
CREATE TABLE page_content (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  page VARCHAR(50) NOT NULL, -- 'restaurant', 'explore', etc.
  title VARCHAR(255),
  subtitle VARCHAR(255),
  UNIQUE(venue_id, page)
);

-- Page Sections
CREATE TABLE page_sections (
  id SERIAL PRIMARY KEY,
  page_content_id INTEGER REFERENCES page_content(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT,
  image VARCHAR(500),
  layout VARCHAR(50) DEFAULT 'text-only', -- text-only, image-left, image-right
  sort_order INTEGER DEFAULT 0
);

-- App Users (for admin login)
CREATE TABLE app_users (
  id SERIAL PRIMARY KEY,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin', -- admin, staff (future)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_menus_venue ON menus(venue_id);
CREATE INDEX idx_menu_sections_menu ON menu_sections(menu_id);
CREATE INDEX idx_menu_items_section ON menu_items(section_id);
CREATE INDEX idx_rooms_venue ON rooms(venue_id);
CREATE INDEX idx_attractions_venue ON attractions(venue_id);
```

---

## Getting Started Checklist

### Project Structure
```
venue-manager/
├── api/                    # Express backend
│   ├── routes/
│   │   ├── venue/
│   │   ├── menus/
│   │   ├── items/
│   │   ├── auth/
│   │   └── ...
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   ├── apiLogger.js
│   │   └── transaction.js
│   ├── config/
│   │   └── config.js
│   ├── database.js
│   └── server.js
├── admin/                  # Next.js frontend
│   └── (standard next.js structure)
├── docs/
│   └── DB-Schema.sql
└── .env
```

### Setup Steps

1. [ ] Create project folder structure (api + admin)
2. [ ] Set up Express backend with central database.js
3. [ ] Create PostgreSQL database and run schema SQL
4. [ ] Set up JWT auth middleware (verifyToken)
5. [ ] Build API routes following API-Rules.md patterns
6. [ ] Create Next.js admin frontend: `npx create-next-app@latest admin --typescript --tailwind --eslint --app --src-dir`
7. [ ] Install Shadcn/UI in admin: `npx shadcn@latest init`
8. [ ] Build admin UI starting with Menu management (highest value)
9. [ ] Seed database with Nags Head data (copy from mock.ts)
10. [ ] Test API responses match TypeScript types exactly
11. [ ] Connect public website to API

---

## Reference Files

**IMPORTANT - API Rules**: `docs/API-Rules.md` - **Read this first. All API development must follow these patterns.**

**Types Contract**: `nagsheadgarthmyl-web/src/types/index.ts`
**Mock Data Example**: `nagsheadgarthmyl-web/src/lib/data/mock.ts`
**Service Functions**: `nagsheadgarthmyl-web/src/lib/services/venue.ts`
**Architecture Decisions**: `docs/architecture-decisions.md`

---

## Success Criteria

The Venue Manager MVP is complete when:

1. Venue owner can log in securely
2. Can edit all venue information (name, contact, hours)
3. Can create, edit, and reorder menus with sections and items
4. Can toggle item availability ("86" button)
5. Can upload menu PDFs
6. Public website fetches data from API instead of mock
7. Changes appear on public site within cache window (1hr for menus)

---

*Document created for handoff to new Claude Code session*
*Related project: nagsheadgarthmyl (public website)*
