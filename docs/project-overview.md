# PubWeb

Hospitality platform for pubs, inns, and restaurants. Modern websites with self-service content management.

## Structure

```
pubweb/
├── nagsheadgarthmyl-web/    # The Nags Head Inn - public website (Next.js)
├── venuemanager-express/    # Venue Manager API (Express.js) - coming soon
├── venuemanager-web/        # Venue Manager admin UI (Next.js) - coming soon
├── [othervenue-web/]        # Future venue sites
└── docs/                    # Shared documentation
```

## Projects

### nagsheadgarthmyl-web
Public website for The Nags Head Inn, Garthmyl. Built with Next.js, TypeScript, and Tailwind CSS.

```bash
cd nagsheadgarthmyl-web
npm install
npm run dev
```

### venuemanager-express
Backend API for the Venue Manager admin tool. Node.js + Express + PostgreSQL.

### venuemanager-web
Admin interface for venue owners to manage their content (menus, hours, rooms, etc.).

## Documentation

- `docs/API-Rules.md` - API development standards
- `docs/architecture-decisions.md` - Technical decisions and rationale
- `docs/venue-manager-brief.md` - Venue Manager project specification

## Adding a New Venue

1. Copy an existing venue web folder (e.g., `nagsheadgarthmyl-web`)
2. Rename to `newvenue-web`
3. Update content and environment variables
4. Configure Venue Manager with venue data
