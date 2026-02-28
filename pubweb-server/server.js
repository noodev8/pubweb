/*
=======================================================================
Venue Manager API - Express Server
=======================================================================
Main entry point for the Venue Manager backend API.
Handles venue content management for hospitality businesses.
=======================================================================
*/

const express = require('express');
const cors = require('cors');
const config = require('./config/config');

// Initialize Express
const app = express();

// =======================================================================
// Middleware
// =======================================================================

// Parse JSON bodies
app.use(express.json());

// Enable CORS for frontend requests
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Request logging middleware - only logs when CHECK_API_CALL=YES
app.use((req, res, next) => {
  if (process.env.CHECK_API_CALL === 'YES') {
    const timestamp = new Date().toLocaleString();
    console.log(`[API CALL] ${req.method} ${req.path} - ${timestamp}`);
  }
  next();
});

// Auto-flag unpublished changes on mutating routes
const unpublishedMiddleware = require('./middleware/unpublished');
app.use(unpublishedMiddleware);

// =======================================================================
// Routes
// =======================================================================

// Auth routes
const loginRoute = require('./routes/auth/login');
app.use('/api/auth', loginRoute);

// Venue routes
const getVenueRoute = require('./routes/venue/get_venue');
const updateVenueRoute = require('./routes/venue/update_venue');
const getPublishStatusRoute = require('./routes/venue/get_publish_status');
const deployVenueRoute = require('./routes/venue/deploy_venue');
app.use('/api/venue', getVenueRoute);
app.use('/api/venue', updateVenueRoute);
app.use('/api/venue', getPublishStatusRoute);
app.use('/api/venue', deployVenueRoute);

// Hours routes
const getHoursRoute = require('./routes/hours/get_hours');
const updateHoursRoute = require('./routes/hours/update_hours');
app.use('/api/hours', getHoursRoute);
app.use('/api/hours', updateHoursRoute);

// Menu routes
const getMenusRoute = require('./routes/menus/get_menus');
const getMenuRoute = require('./routes/menus/get_menu');
const createMenuRoute = require('./routes/menus/create_menu');
const updateMenuRoute = require('./routes/menus/update_menu');
const deleteMenuRoute = require('./routes/menus/delete_menu');
app.use('/api/menus', getMenusRoute);
app.use('/api/menus', getMenuRoute);
app.use('/api/menus', createMenuRoute);
app.use('/api/menus', updateMenuRoute);
app.use('/api/menus', deleteMenuRoute);

// Section routes
const createSectionRoute = require('./routes/sections/create_section');
const updateSectionRoute = require('./routes/sections/update_section');
const deleteSectionRoute = require('./routes/sections/delete_section');
app.use('/api/sections', createSectionRoute);
app.use('/api/sections', updateSectionRoute);
app.use('/api/sections', deleteSectionRoute);

// Item routes
const createItemRoute = require('./routes/items/create_item');
const updateItemRoute = require('./routes/items/update_item');
const deleteItemRoute = require('./routes/items/delete_item');
const toggleAvailabilityRoute = require('./routes/items/toggle_availability');
app.use('/api/items', createItemRoute);
app.use('/api/items', updateItemRoute);
app.use('/api/items', deleteItemRoute);
app.use('/api/items', toggleAvailabilityRoute);

// Accommodation routes
const getAccommodationRoute = require('./routes/accommodation/get_accommodation');
const updateAccommodationRoute = require('./routes/accommodation/update_accommodation');
app.use('/api/accommodation', getAccommodationRoute);
app.use('/api/accommodation', updateAccommodationRoute);

// Room routes
const createRoomRoute = require('./routes/rooms/create_room');
const updateRoomRoute = require('./routes/rooms/update_room');
const deleteRoomRoute = require('./routes/rooms/delete_room');
app.use('/api/rooms', createRoomRoute);
app.use('/api/rooms', updateRoomRoute);
app.use('/api/rooms', deleteRoomRoute);

// Attraction routes
const getAttractionsRoute = require('./routes/attractions/get_attractions');
const createAttractionRoute = require('./routes/attractions/create_attraction');
const updateAttractionRoute = require('./routes/attractions/update_attraction');
const deleteAttractionRoute = require('./routes/attractions/delete_attraction');
app.use('/api/attractions', getAttractionsRoute);
app.use('/api/attractions', createAttractionRoute);
app.use('/api/attractions', updateAttractionRoute);
app.use('/api/attractions', deleteAttractionRoute);

// Page routes
const getPageRoute = require('./routes/pages/get_page');
const updatePageRoute = require('./routes/pages/update_page');
app.use('/api/pages', getPageRoute);
app.use('/api/pages', updatePageRoute);

// Cloudinary routes
const signUploadRoute = require('./routes/cloudinary/sign_upload');
app.use('/api/cloudinary', signUploadRoute);

// Menu image routes
const uploadMenuImageRoute = require('./routes/menu-images/upload_image');
const deleteMenuImageRoute = require('./routes/menu-images/delete_image');
const replaceMenuImageRoute = require('./routes/menu-images/replace_image');
const reorderMenuImagesRoute = require('./routes/menu-images/reorder_images');
app.use('/api/menu-images', uploadMenuImageRoute);
app.use('/api/menu-images', deleteMenuImageRoute);
app.use('/api/menu-images', replaceMenuImageRoute);
app.use('/api/menu-images', reorderMenuImagesRoute);

// Gallery routes
const getGalleryRoute = require('./routes/gallery/get_gallery');
const uploadGalleryImageRoute = require('./routes/gallery/upload_image');
const updateGalleryImageRoute = require('./routes/gallery/update_image');
const deleteGalleryImageRoute = require('./routes/gallery/delete_image');
const replaceGalleryImageRoute = require('./routes/gallery/replace_image');
const reorderGalleryRoute = require('./routes/gallery/reorder_gallery');
app.use('/api/gallery', getGalleryRoute);
app.use('/api/gallery', uploadGalleryImageRoute);
app.use('/api/gallery', updateGalleryImageRoute);
app.use('/api/gallery', deleteGalleryImageRoute);
app.use('/api/gallery', replaceGalleryImageRoute);
app.use('/api/gallery', reorderGalleryRoute);

// =======================================================================
// Health Check
// =======================================================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =======================================================================
// Error Handling
// =======================================================================

// 404 handler
app.use((req, res) => {
  res.status(200).json({
    return_code: 'ROUTE_NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(200).json({
    return_code: 'SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
});

// =======================================================================
// Start Server
// =======================================================================

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`
=======================================================================
  Venue Manager API
  Running on port ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
=======================================================================
  `);
});

module.exports = app;
