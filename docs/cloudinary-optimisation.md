# Cloudinary Optimisation & Cost Reduction Plan

## Overview

This document covers the full Cloudinary cost optimisation strategy for Online Front Door. Cloudinary
bills on **three pillars**: storage, transformations, and bandwidth. Our goal is to minimise
all three while keeping the platform robust and the admin experience simple.

**Decision**: Keep Cloudinary. The free tier (25 credits/month) comfortably covers our scale
(max 9 gallery images + a handful of menu images/PDFs per venue). It provides upload, storage,
global CDN, on-the-fly transformations, and a management dashboard. Replacing it with
self-hosted storage + Next.js image optimisation would be significant engineering for no
cost saving at our volume.

---

## How Cloudinary Credits Work

| Credit component | What counts | Current state | Optimised state |
|------------------|-------------|---------------|-----------------|
| **Bandwidth** | Every byte delivered to end users | Raw originals served (often multi-MB) | Optimised delivery: auto-format, auto-quality, capped width |
| **Transformations** | Each unique format/size/quality combo generated | Zero transforms (serving raw files) | `f_auto,q_auto,w_X` per image — cached after first request |
| **Storage** | Total bytes stored in your account | Full-resolution originals, plus orphaned files never deleted | Resized on upload, orphans cleaned up automatically |

**Key insight**: Adding transformations on delivery (`f_auto,q_auto`) actually **reduces** overall
credit usage because the bandwidth savings far outweigh the small transformation cost.
A 4MB JPEG served as-is costs more in bandwidth credits than a 200KB auto-optimised WebP
with a one-time transformation credit.

---

## Current Architecture

- **Cloud name**: dnrevr0pi
- **Upload preset**: pubweb (client-side, potentially unsigned)
- **SDK**: cloudinary v2.9.0 (server-side)
- **Folders**: `pubweb/gallery`, `pubweb/menus`, `pubweb/menus/pdf`

### Cost Profile (after Phase 1)

| Area | Before | After Phase 1 |
|------|--------|---------------|
| **Gallery display** | Raw originals served (multi-MB) | `f_auto,q_auto` — thumbnails w_600, featured w_1200, lightbox w_1600 |
| **Menu image display** | Raw originals in lightbox | `f_auto,q_auto` — thumbnails w_400, lightbox w_1200 |
| **Menu PDF delivery** | Full PDF proxied to user | Unchanged (Phase 3 candidate) |
| **Gallery upload** | 10MB max, no resize | 5MB max, auto-resized to 2000px with q_auto |
| **Menu image upload** | 10MB max, no resize | 5MB max, auto-resized to 2000px with q_auto |
| **Menu PDF upload** | 20MB max, no processing | Unchanged |
| **Gallery delete/replace** | Deletes from Cloudinary | Unchanged (already worked) |
| **Menu image/PDF remove** | Sets URL to '' — orphaned file | Now deletes from Cloudinary before clearing URL |
| **Menu deletion** | DB CASCADE only — orphaned files | Now deletes image + PDF from Cloudinary before DB delete |
| **Cleanup script** | Only checked menus table | Now also checks gallery_images table |
| **Upload preset** | Possibly unsigned, no restrictions | Dashboard protections checklist (see 1.5) |

---

## Action Items

### Phase 1 — Quick Wins (Low effort, high impact) — DONE

All code changes complete. Dashboard protections (1.5) require manual action.

---

#### 1.1 Optimise delivery URLs with auto-format and auto-quality — DONE

Added `f_auto,q_auto,c_limit,w_X` to all Cloudinary image URLs via a shared utility.
Cloudinary generates and caches each transformed variant on first request — subsequent
requests are served from CDN cache at no additional transformation cost.

**What was done**:
- Created shared utility `sites/nagsheadgarthmyl-web/src/lib/cloudinary.ts` with `optimisedUrl(url, width)`
- Applied to all display components:

| File | Context | Width |
|------|---------|-------|
| `GalleryGrid.tsx` | Gallery thumbnails | 600 |
| `GalleryGrid.tsx` | Featured image | 1200 |
| `GalleryGrid.tsx` | Lightbox full image | 1600 |
| `MenuSelection.tsx` | Menu card thumbnails | 400 |
| `MenuSelection.tsx` | Lightbox full menu image | 1200 |

Events page skipped — uses placeholder, no Cloudinary images rendered.

**Status**: [x] Done

---

#### 1.2 Resize images at upload time — DONE

Images are now capped at 2000x2000px with `q_auto` at upload time. Max client-side
file size reduced from 10MB to 5MB.

**What was done**:
- Added `formData.append('transformation', 'c_limit,w_2000,h_2000,q_auto')` to:
  - `pubweb-web/src/components/admin/gallery-slot.tsx` — gallery uploads
  - `pubweb-web/src/components/admin/image-upload.tsx` — menu image uploads
- Reduced max file size validation from 10MB to 5MB in both components
- Updated UI text to show "max 5MB"

**Status**: [x] Done

---

#### 1.3 Delete Cloudinary assets when menu images/PDFs are removed — DONE

Menu routes now clean up Cloudinary assets automatically, matching the pattern gallery
already used. Failures are logged but don't block the operation — the cleanup script
can catch any orphans later.

**What was done**:
- Added `extractPublicId(url)` to shared `pubweb-server/utils/cloudinary.js`
- `update_menu.js` — before updating, queries current `image_url`/`pdf_url`. If being
  changed or cleared, deletes old asset from Cloudinary
- `delete_menu.js` — before DB delete, fetches `image_url` and `pdf_url` and deletes
  both from Cloudinary

**Status**: [x] Done

---

#### 1.4 Fix cleanup script to include gallery_images — DONE

The orphan detection script now checks all tables that reference Cloudinary assets.

**What was done**:
- Added `gallery_images.image_url` query to `getDatabaseImageUrls()` in `clean-cloudinary.js`
- Updated script header comment

**Status**: [x] Done

---

#### 1.5 Cloudinary account & preset protections — ACTION REQUIRED

These are dashboard settings, not code changes, but critical for cost protection.

**Upload preset restrictions** (Settings > Upload Presets > `pubweb`):
- [ ] Max file size: 5MB (images), separate preset or check for PDFs at 10MB
- [ ] Allowed formats: jpg, png, webp (images), pdf (PDFs)
- [ ] Folder restriction: lock to `pubweb/` prefix only
- [ ] Max image dimensions: 4000x4000px
- [ ] Consider making the preset **signed** (requires server-side signature, prevents abuse)

**Account-level protections** (Settings > Security / Billing):
- [ ] Enable usage notifications at 50%, 75%, 90% of plan limits
- [ ] Set a hard spending limit / credit cap
- [ ] Consider enabling **strict transformations** mode — only pre-approved transformation
      strings will work, preventing anyone from crafting expensive transforms via URL manipulation

**Status**: [ ] Requires manual dashboard action

---

### Phase 2 — Medium Effort Improvements

---

#### 2.1 Responsive image sizing

Currently the same image URL is served regardless of viewport. A phone on mobile data
downloads the same 1200px image as a desktop on fibre.

**Approach**: Use Cloudinary URL transforms at multiple widths and serve via `srcSet`:

```tsx
const widths = [400, 800, 1200];
const srcSet = widths.map(w => `${optimisedUrl(src, w)} ${w}w`).join(', ');

<Image
  src={optimisedUrl(src, 1200)}
  srcSet={srcSet}
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
/>
```

Cloudinary caches each width variant on its CDN. After first request, subsequent requests
for the same size are served from cache at no additional transformation cost.

**Files to update**: Same display files as 1.1 — gallery grid, menu selection, events page.

**Status**: [ ] Not started

---

#### 2.2 Add `cloudinary_public_id` to menus table

The `gallery_images` table already stores `cloudinary_public_id` alongside the URL.
The `menus` table only stores URLs, requiring public_id extraction via URL parsing.

**Schema change**:
```sql
ALTER TABLE menus ADD COLUMN image_cloudinary_public_id VARCHAR(255);
ALTER TABLE menus ADD COLUMN pdf_cloudinary_public_id VARCHAR(255);
```

**Files to update**:
- `pubweb-web/src/app/admin/menus/[id]/page.tsx` — send public_id on upload
- `pubweb-server/routes/menus/create_menu.js` — accept and store
- `pubweb-server/routes/menus/update_menu.js` — accept and store
- `pubweb-web/src/lib/api.ts` — update Menu interface

This makes Cloudinary deletion reliable without URL parsing, and aligns menus with the
gallery pattern.

**Status**: [ ] Not started

---

### Phase 3 — Future Considerations

---

#### 3.1 Convert PDF menus to page images

**Current state**: Admins create menus in Canva, export as PDF, upload the PDF. End users
download the full PDF or view it in the browser's native PDF viewer. Mobile UX is
inconsistent — different browsers handle PDFs differently.

**Proposed state**: Admins export individual pages from Canva as PNG images (Canva supports
this natively). Pages are uploaded and stored as ordered images. The frontend displays them
in a scrollable/swipeable viewer.

**Cost benefits**:
- Each page image gets full Cloudinary optimisation (f_auto, q_auto, responsive sizing)
- Lazy-load pages — only load what the user scrolls to, instead of entire PDF
- Smaller total bandwidth than full PDF download
- Eliminates the separate image + PDF upload (first page becomes the thumbnail)

**UX benefits**:
- Consistent display across all devices
- No external PDF viewer, user stays on site
- `yet-another-react-lightbox` (already installed) supports multi-image slideshows

**Trade-offs**:
- Admins change their export step (PNG pages instead of PDF) — minor workflow shift
- Requires new `menu_pages` table with `sort_order`
- Requires a new page viewer component

**Decision**: Deferred until Phase 1 & 2 are complete.

**Status**: [ ] Not started

---

## Cost Reduction Summary

| Change | Bandwidth | Storage | Transforms | Protection |
|--------|-----------|---------|------------|------------|
| 1.1 `f_auto,q_auto,w_X` delivery | **-60-80%** | — | Small increase (cached) | — |
| 1.2 Resize on upload | -10-20% (smaller originals) | **-70-90%** | — | — |
| 1.3 Delete assets on menu remove | — | **Stops growth** | — | — |
| 1.4 Fix cleanup script | — | Catches orphans | — | — |
| 1.5 Account/preset protections | — | — | — | **Prevents abuse/surprise bills** |
| 2.1 Responsive sizing | **-20-40% more** | — | Small increase (cached) | — |
| 2.2 Menu public_id columns | — | Reliable cleanup | — | — |
| 3.1 PDF to page images | **Replaces PDF downloads** | Less than PDFs | Per-page optimisation | — |

**Combined Phase 1 impact estimate**: 70-90% bandwidth reduction, 70-90% storage reduction
on new uploads, and full protection against orphan accumulation and abuse.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `pubweb-server/utils/cloudinary.js` | Cloudinary config, `deleteImage()`, `extractPublicId()` |
| `pubweb-server/scripts/clean-cloudinary.js` | Orphan detection/cleanup (menus + gallery) |
| `sites/nagsheadgarthmyl-web/src/lib/cloudinary.ts` | Delivery URL optimisation utility |
| `pubweb-web/src/components/admin/gallery-slot.tsx` | Gallery upload (5MB limit, 2000px resize) |
| `pubweb-web/src/components/admin/image-upload.tsx` | Menu image upload (5MB limit, 2000px resize) |
| `pubweb-web/src/components/admin/pdf-upload.tsx` | Menu PDF upload |
| `pubweb-server/routes/gallery/delete_image.js` | Gallery delete (has Cloudinary cleanup) |
| `pubweb-server/routes/gallery/replace_image.js` | Gallery replace (has Cloudinary cleanup) |
| `pubweb-server/routes/menus/update_menu.js` | Menu update (now has Cloudinary cleanup) |
| `pubweb-server/routes/menus/delete_menu.js` | Menu delete (now has Cloudinary cleanup) |
| `sites/nagsheadgarthmyl-web/src/components/gallery/GalleryGrid.tsx` | Gallery display (optimised URLs) |
| `sites/nagsheadgarthmyl-web/src/app/menus/MenuSelection.tsx` | Menu display + lightbox (optimised URLs) |
