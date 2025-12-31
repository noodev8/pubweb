# Venue Manager API

Express.js backend API for the Venue Manager admin tool.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Configure your `.env` with database credentials and JWT secret.

4. Create PostgreSQL database and run schema:
```bash
psql -d venuemanager -f docs/DB-Schema.sql
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

All endpoints use POST method and return HTTP 200 with `return_code`.

### Auth
- `POST /api/auth/login` - Authenticate user

### Venue
- `POST /api/venue/get_venue` - Get venue info
- `POST /api/venue/update_venue` - Update venue (auth required)

### Hours
- `POST /api/hours/get_hours` - Get opening hours
- `POST /api/hours/update_hours` - Update hours (auth required)

### Menus
- `POST /api/menus/get_menus` - Get all menus with sections/items
- `POST /api/menus/get_menu` - Get single menu
- `POST /api/menus/create_menu` - Create menu (auth required)
- `POST /api/menus/update_menu` - Update menu (auth required)
- `POST /api/menus/delete_menu` - Delete menu (auth required)

### Sections
- `POST /api/sections/create_section` - Create section (auth required)
- `POST /api/sections/update_section` - Update section (auth required)
- `POST /api/sections/delete_section` - Delete section (auth required)

### Items
- `POST /api/items/create_item` - Create item (auth required)
- `POST /api/items/update_item` - Update item (auth required)
- `POST /api/items/delete_item` - Delete item (auth required)
- `POST /api/items/toggle_availability` - Quick 86 toggle (auth required)

### Accommodation
- `POST /api/accommodation/get_accommodation` - Get accommodation and rooms
- `POST /api/accommodation/update_accommodation` - Update accommodation (auth required)

### Rooms
- `POST /api/rooms/create_room` - Create room (auth required)
- `POST /api/rooms/update_room` - Update room (auth required)
- `POST /api/rooms/delete_room` - Delete room (auth required)

### Attractions
- `POST /api/attractions/get_attractions` - Get attractions
- `POST /api/attractions/create_attraction` - Create attraction (auth required)
- `POST /api/attractions/update_attraction` - Update attraction (auth required)
- `POST /api/attractions/delete_attraction` - Delete attraction (auth required)

### Pages
- `POST /api/pages/get_page` - Get page content
- `POST /api/pages/update_page` - Update page (auth required)

## Response Format

All responses return HTTP 200 with a `return_code`:

```json
{
  "return_code": "SUCCESS",
  "data": { ... }
}
```

Error example:
```json
{
  "return_code": "MISSING_FIELDS",
  "message": "venue_id is required"
}
```

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Obtain token via `/api/auth/login`.
