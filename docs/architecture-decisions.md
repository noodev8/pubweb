# Architecture Decisions

This document captures key architectural decisions made before implementation, with a focus on multi-venue scalability.

---

## Business Context

**Target customer:** Independent pubs, inns, and restaurants currently on WordPress (or similar) with agency dependency.

**Pain point:** Small changes (opening hours, menu updates) require agency involvement—cost, delay, and friction mean websites go stale.

**Value proposition:** "Your site, but faster—and you control your own menus and hours."

**Approach:**
- Rebuild sites to look and feel the same (no client shock)
- Modern stack = faster load times
- Venue Manager = self-service for content that changes (menus, hours, events)
- No agency call for routine updates

**What the Venue Manager provides (V2+):**
- Simple dashboard for non-technical pub owners
- Update menus, opening hours, special events
- Changes go live in seconds via on-demand revalidation

---

## Nags Head: Page Structure

Mirrors the existing site structure to ensure continuity. One new addition (Events).

| Page | Route | Purpose |
|------|-------|---------|
| **Home** | `/` | Hero, welcome, teasers for dining/accommodation/area |
| **Accommodation** | `/accommodation` | 8 en-suite rooms, amenities, eviivo booking link |
| **Restaurant** | `/restaurant` | The dining space, ambiance, AA Rosette |
| **Menus** | `/menus` | Food & drink menus (self-service in V2) |
| **Explore** | `/explore` | Local attractions - Powis Castle, Lake Vyrnwy, canal |
| **Events** | `/events` | Special menus - Mother's Day, Christmas, etc. (new) |
| **Contact** | `/contact` | Hours, location, phone, email |

**External integrations:**
- **eviivo** - Accommodation booking (external link, no build required)

**Key brand notes:**
- Grade 2 listed former coaching inn
- AA Rosette for culinary excellence
- 5-star AA & Visit Wales accommodation
- "Local, quality, homemade" messaging
- Traditional but welcoming

---

## 1. Data Abstraction Approach

**Status:** Decided

**Context:**
V1 uses mocked/hard-coded data. V2 will pull from an external Venue Manager API. We need a pattern that makes this transition seamless without touching component code.

**Options considered:**
- **A: Simple service functions** - Direct functions in `/lib/services/`, components call directly
- **B: Repository pattern** - Interface + implementations, swap via config
- **C: Content layer abstraction** - Flexible multi-source layer (overkill for scope)

**Decision:**
Option A with elements of B: Simple service functions with strict TypeScript types defined separately.

```
/types/venue.ts         → VenueInfo, MenuItem, OpeningHours, etc.
/lib/services/venue.ts  → getVenueInfo(), getMenuSections(), getOpeningHours()
```

**Rationale:**
- Simplicity of service functions keeps V1 lean and understandable
- Strict shared types act as the contract—enforced by TypeScript, not runtime
- Swapping from mock to API means changing function internals, not signatures
- Avoids interface/implementation ceremony that adds little value at this scale

---

## 1b. Caching & Fallback Strategy

**Status:** Decided

**Context:**
V1 (local data) is instant. V2 (API) introduces latency. Hospitality data (menus, hours, venue info) changes infrequently—ideal for caching. Need strategy for API failures.

**Caching approach:**
| Data type | Revalidation | Rationale |
|-----------|--------------|-----------|
| Venue info (name, description, branding) | 24 hours | Rarely changes |
| Opening hours | 24 hours | Updated occasionally |
| Menus | 1 hour | More frequent updates |
| Gallery/images | 24 hours | Rarely changes |

- Use Next.js `fetch` with `{ next: { revalidate: N } }` in service functions
- Add on-demand revalidation via webhook when Venue Manager exists (V2+)

**Fallback approach (priority order):**
1. **Stale-while-revalidate** (default) - Serve cached data while refreshing in background
2. **Graceful degradation** - Components handle missing data with sensible empty states, not crashes
3. **Build-time guarantee** - Deploy fails if critical data unavailable; live site always valid

**Implementation notes:**
- Service functions should accept caching hints even in V1 (ignored but ready)
- Components must never assume data exists—always handle undefined/empty gracefully
- No static fallback JSON maintained; stale cache + graceful degradation sufficient

---

## 2. Component Granularity

**Status:** Decided

**Context:**
Hospitality sites have repeating patterns (menus, hours, galleries, contact sections). Need to determine the right level of componentisation—but without building a generic template system.

**Options considered:**
- **Option 1: Page-level fetching, presentational components** - Pages own data, pass as props
- **Option 2: Self-fetching domain components** - Components fetch their own data
- **Option 3: Hybrid** - Mix of both approaches

**Decision:**
Option 1: Page-level data fetching with presentational components.

**Component layers:**
```
/components/ui/          → Primitives (Button, Card, Badge) - pure UI, no data awareness
/components/             → Domain components (MenuSection, OpeningHours, Hero) - typed to data shapes, receive props
/app/                    → Pages - fetch data via services, compose and pass to components
```

**Data flow:**
```
page.tsx
  → calls getMenuSections() from /lib/services
  → passes data to <MenuSection items={data} />
  → MenuSection renders <MenuItem> for each item
```

**Rationale:**
- Clear, predictable data flow—easy to trace where data comes from
- Components are testable in isolation (just pass props)
- No hidden data dependencies or duplicate fetches
- Prop drilling is minimal for a site of this scope
- Keeps complexity low—this is a website, not a component library

**Guiding principle:**
Build components that feel right for Nags Head. No pressure to make them "generic enough for any venue." If Pub 2 needs different components, Pub 2 gets different components.

---

## 3. Venue-Specific vs. Shared

**Status:** Decided

**Context:**
Multi-venue future requires clarity on what's shared across the platform vs. what belongs to individual venues.

**Architecture model:**
```
┌─────────────────────────────────────────────────────────┐
│                  VENUE MANAGER API                      │
│           (single repo, single source of truth)         │
│     Serves: venue info, menus, hours, events, etc.      │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
     │  Nags Head  │ │   Pub 2     │ │   Pub 3     │
     │   (repo)    │ │   (repo)    │ │   (repo)    │
     │  Own site   │ │  Own site   │ │  Own site   │
     └─────────────┘ └─────────────┘ └─────────────┘
```

**What's shared across all venues:**
- **Data contract** - TypeScript types matching Venue Manager API responses
- **API endpoints** - All venues talk to the same Venue Manager
- That's it.

**What's NOT shared:**
- Frontend code (components, layouts, pages)
- Styling and branding
- Site structure and navigation
- Deployment configuration

**Decision:**
Each venue gets its own repository with its own frontend. Sharing happens at the API/data layer, not the component layer.

**Rationale:**
- **No abstraction tax** - Nags Head is built for Nags Head, not for "any pub"
- **Freedom to diverge** - A cocktail bar can look completely different from a traditional pub
- **Complexity centralised** - Business logic lives in Venue Manager; frontends are pure presentation
- **Copy-and-modify works** - Pub 2 can fork Nags Head as a starting point, or start fresh
- **No multi-tenant gymnastics** - No theming engines, config layers, or conditional rendering

**The discipline required:**
Keep data types/contracts in sync. When Venue Manager API changes, all frontends must agree on the new shapes.

**Suggested approach for types:**
- V1: Types defined locally in each frontend repo
- V2+: Consider a shared `@venue-platform/types` npm package that all repos depend on

This keeps frontends decoupled from each other while ensuring they all speak the same language to the API.

---

## 4. Venue Identification (V2)

**Status:** Decided

**Context:**
When frontends call the Venue Manager API, how does the API know which venue's data to return? Need a simple, explicit mechanism that fits the "each venue = own deployment" model.

**Options considered:**
- **Option 1: Environment variable** - `VENUE_ID` set per Vercel project
- **Option 2: API base URL per venue** - Different namespace per venue
- **Option 3: Venue slug in paths** - `/api/venues/nags-head/menus`
- **Option 4: Domain detection** - API reads Origin header, maps to venue

**Decision:**
Option 1: Environment variable per deployment.

```
# .env.local (or Vercel project settings)
VENUE_ID=nags-head
VENUE_API_URL=https://api.venue-manager.com/v1
```

**How it works:**
```typescript
// lib/services/venue.ts (V2)
const VENUE_ID = process.env.VENUE_ID

export async function getMenus(): Promise<Menu[]> {
  return fetch(`${VENUE_API_URL}/menus`, {
    headers: { 'X-Venue-ID': VENUE_ID },
    next: { revalidate: 3600 }
  }).then(res => res.json())
}
```

**Rationale:**
- Simple and explicit—one env var is the source of venue identity
- Service functions stay clean (`/menus` not `/venues/x/menus`)
- Easy local testing—change env var, get different venue data
- Fits Vercel's per-project environment variables perfectly
- No magic domain detection or implicit behaviour

**V1 impact:** None. Env var exists but isn't used until API is built.

---

## Summary

| Area | Decision | Notes |
|------|----------|-------|
| Data Abstraction | Service functions + strict types | `/lib/services/` + `/types/` |
| Caching | Time-based revalidation | 1hr menus, 24hr venue info |
| Fallback | Stale-while-revalidate + graceful degradation | Components handle empty states |
| Component Granularity | Page-level fetching, presentational components | No self-fetching components |
| Venue vs. Shared | Separate repos, shared API contract only | No shared frontend code |
| Venue Identification | Environment variable per deployment | `VENUE_ID` in env, sent as header |

---

## Next Steps

1. Set up Next.js project structure for Nags Head
2. Define initial TypeScript types in `/types/`
3. Create service functions with mock data in `/lib/services/`
4. Build first page with presentational components
