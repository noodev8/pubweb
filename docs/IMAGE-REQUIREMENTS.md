# Image Requirements for Venue Websites

Use this checklist when setting up a new venue website. All images should be placed in `/public/images/`.

---

## Hero Images (Standard)

All hero/banner images across the site use the same standard size for consistency.

| Size | Ratio | Notes |
|------|-------|-------|
| **1920 x 1080** | **16:9** | Standard for all hero images |

The site displays heroes at their native 16:9 aspect ratio - the full image is shown, not cropped. On smaller screens, the height scales proportionally with the width.

### Hero Image Files
| Filename | Description |
|----------|-------------|
| `hero-1.jpg` | Homepage carousel - building exterior, dusk/night with lights |
| `hero-2.jpg` | Homepage carousel - building exterior, daytime |
| `explore-hero.jpg` | Explore page carousel - local landscape (e.g., Lake Vyrnwy) |
| `explore-hero-2.jpg` | Explore page carousel - second landscape (e.g., canal) |
| `restaurant-hero.jpg` | Restaurant page - interior or signature dish |
| `accommodation-hero.jpg` | Accommodation page - best bedroom or exterior |

---

## Homepage Images

### Content Sections
| Filename | Size | Ratio | Description |
|----------|------|-------|-------------|
| `restaurant.jpg` | 800 x 600 | 4:3 | Restaurant/dining room interior showing character (beams, decor, tables set) |
| `bedroom.jpg` | 800 x 600 | 4:3 | Best bedroom - made up, good lighting, showing style/quality |

### Explore/Area Section
| Filename | Size | Ratio | Description |
|----------|------|-------|-------------|
| `attraction-1.jpg` | 800 x 600 | 4:3 | Local attraction #1 (e.g., castle, landmark) |
| `attraction-2.jpg` | 800 x 600 | 4:3 | Local attraction #2 (e.g., lake, nature spot) |

### Explore Page Content
| Filename | Size | Ratio | Description |
|----------|------|-------|--------------|
| `explore-cycling.jpg` | 800 x 600 | 4:3 | Cycling/walking scene - canal towpath, lake path, or countryside walk |
| `explore-castles.jpg` | 800 x 600 | 4:3 | Castle or historic building - Powis Castle with deer is ideal |

### Awards Section
| Filename | Size | Ratio | Description |
|----------|------|-------|-------------|
| `award-1.jpg` | 200 x 200 | 1:1 | Award badge/logo #1 |
| `award-2.jpg` | 200 x 200 | 1:1 | Award badge/logo #2 |
| `award-3.jpg` | 200 x 200 | 1:1 | Award badge/logo #3 (optional) |
| `award-4.jpg` | 200 x 200 | 1:1 | Award badge/logo #4 (optional) |

### Branding
| Filename | Size | Ratio | Description |
|----------|------|-------|-------------|
| `logo.svg` | Any | 1:1 | Venue logo - SVG preferred for crisp scaling |
| `logo.png` | 400 x 400 | 1:1 | Fallback if SVG not available |

---

## Other Pages (Future)

### Accommodation Page
| Filename | Size | Ratio | Description |
|----------|------|-------|-------------|
| `room-1.jpg` | 800 x 600 | 4:3 | Room 1 main photo |
| `room-1-bathroom.jpg` | 800 x 600 | 4:3 | Room 1 bathroom |
| `room-2.jpg` | 800 x 600 | 4:3 | Room 2 main photo |
| *(repeat for each room)* | | | |

### Restaurant Page
| Filename | Size | Ratio | Description |
|----------|------|-------|-------------|
| `dining-1.jpg` | 800 x 600 | 4:3 | Dining room view 1 |
| `dining-2.jpg` | 800 x 600 | 4:3 | Dining room view 2 / different area |
| `food-1.jpg` | 800 x 600 | 4:3 | Signature dish photo |
| `food-2.jpg` | 800 x 600 | 4:3 | Another dish photo |

### Gallery (if needed)
| Filename | Size | Ratio | Description |
|----------|------|-------|-------------|
| `gallery-*.jpg` | 1200 x 800 | 3:2 | High quality photos for lightbox gallery |

---

## Image Guidelines

### Quality
- Minimum 72 DPI for web, 150 DPI preferred for retina
- JPEG for photos, PNG for graphics with transparency, SVG for logos
- Compress images (TinyPNG, Squoosh) - aim for < 200KB per image

### Composition
- Hero images: Subject should be centred or have clear space for text overlay (bottom-left)
- 4:3 images: Key content should be centred (edges may be cropped on mobile)
- Avoid text in images (accessibility, doesn't scale well)

### Naming
- Lowercase, hyphens not spaces: `hero-1.jpg` not `Hero 1.jpg`
- Descriptive but short: `bedroom.jpg` not `IMG_20231215_143022.jpg`

---

## Checklist

```
[ ] hero-1.jpg (1920x1080)
[ ] hero-2.jpg (1920x1080)
[x] explore-hero.jpg (1920x1080)
[x] explore-hero-2.jpg (1920x1080)
[x] explore-cycling.jpg (800x600)
[x] explore-castles.jpg (using attraction-1.jpg) (800x600)
[ ] restaurant.jpg (800x600)
[ ] bedroom.jpg (800x600)
[ ] attraction-1.jpg (800x600)
[ ] attraction-2.jpg (800x600)
[ ] award-1.jpg (200x200)
[ ] award-2.jpg (200x200)
[ ] logo.svg
```
