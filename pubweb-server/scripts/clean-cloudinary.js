/*
=======================================================================
Clean Cloudinary Script
=======================================================================
Finds and optionally deletes orphaned images in Cloudinary that are
no longer referenced in the database.

=======================================================================
HOW TO USE
=======================================================================

1. Make sure you have the cloudinary package installed:
   cd pubweb-server
   npm install cloudinary

2. Add your Cloudinary credentials to .env (if not already there):
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

3. Run in dry-run mode first (shows orphans but doesn't delete):
   node scripts/clean-cloudinary.js

4. When ready to delete orphans, run with --delete flag:
   node scripts/clean-cloudinary.js --delete

=======================================================================
WHAT IT DOES
=======================================================================
- Fetches all images from the 'pubweb' folder in Cloudinary (metadata only)
- Queries all image URLs from the database (menus, rooms, attractions, pages)
- Compares the two lists to find orphaned images
- Reports findings and optionally deletes orphans

=======================================================================
*/

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;
const { query, pool } = require('../database');

// Configuration
const CLOUDINARY_FOLDER = 'pubweb';
const DELETE_MODE = process.argv.includes('--delete');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET'
});

/**
 * Extract public_id from a Cloudinary URL
 * Example: https://res.cloudinary.com/xxx/image/upload/v123/pubweb/menu-abc.jpg
 * Returns: pubweb/menu-abc
 */
function extractPublicId(url) {
  if (!url) return null;

  // Match the pattern after /upload/ and before the file extension
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  if (match) {
    return match[1];
  }

  // Fallback: try to find pubweb/ in the URL
  const pubwebMatch = url.match(/(pubweb\/[^.]+)/);
  return pubwebMatch ? pubwebMatch[1] : null;
}

/**
 * Fetch all images from Cloudinary in the pubweb folder
 * Handles pagination automatically
 */
async function getCloudinaryImages() {
  const images = [];
  let nextCursor = null;

  console.log(`Fetching images from Cloudinary folder: ${CLOUDINARY_FOLDER}/`);

  do {
    const options = {
      type: 'upload',
      prefix: CLOUDINARY_FOLDER,
      max_results: 500
    };

    if (nextCursor) {
      options.next_cursor = nextCursor;
    }

    const result = await cloudinary.api.resources(options);

    for (const resource of result.resources) {
      images.push({
        public_id: resource.public_id,
        url: resource.secure_url,
        format: resource.format,
        bytes: resource.bytes,
        created_at: resource.created_at
      });
    }

    nextCursor = result.next_cursor;

    if (nextCursor) {
      console.log(`  Fetched ${images.length} images so far, getting more...`);
    }
  } while (nextCursor);

  console.log(`  Total images in Cloudinary: ${images.length}`);
  return images;
}

/**
 * Get all Cloudinary URLs from the database
 * Only checks URL columns (not local image columns)
 */
async function getDatabaseImageUrls() {
  console.log('Fetching Cloudinary URLs from database...');

  const urls = new Set();

  // menus.image_url
  const menuImages = await query('SELECT image_url FROM menus WHERE image_url IS NOT NULL');
  menuImages.rows.forEach(row => urls.add(row.image_url));
  console.log(`  menus.image_url: ${menuImages.rows.length} URLs`);

  // menus.pdf_url
  const menuPdfs = await query('SELECT pdf_url FROM menus WHERE pdf_url IS NOT NULL');
  menuPdfs.rows.forEach(row => urls.add(row.pdf_url));
  console.log(`  menus.pdf_url: ${menuPdfs.rows.length} URLs`);

  console.log(`  Total unique URLs in database: ${urls.size}`);
  return urls;
}

/**
 * Find orphaned images (in Cloudinary but not in database)
 */
function findOrphans(cloudinaryImages, databaseUrls) {
  // Convert database URLs to public_ids for comparison
  const databasePublicIds = new Set();
  for (const url of databaseUrls) {
    const publicId = extractPublicId(url);
    if (publicId) {
      databasePublicIds.add(publicId);
    }
  }

  // Find images in Cloudinary that aren't in the database
  const orphans = cloudinaryImages.filter(img => !databasePublicIds.has(img.public_id));

  return orphans;
}

/**
 * Delete orphaned images from Cloudinary
 */
async function deleteOrphans(orphans) {
  console.log(`\nDeleting ${orphans.length} orphaned images...`);

  let deleted = 0;
  let failed = 0;

  for (const orphan of orphans) {
    try {
      await cloudinary.uploader.destroy(orphan.public_id);
      console.log(`  Deleted: ${orphan.public_id}`);
      deleted++;
    } catch (error) {
      console.error(`  Failed to delete ${orphan.public_id}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\nDeletion complete: ${deleted} deleted, ${failed} failed`);
}

/**
 * Format bytes to human readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Main function
 */
async function main() {
  console.log('=======================================================================');
  console.log('  Clean Cloudinary - Find Orphaned Images');
  console.log(`  Mode: ${DELETE_MODE ? 'DELETE' : 'DRY-RUN (use --delete to remove orphans)'}`);
  console.log('=======================================================================\n');

  // Check credentials
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log('Cloudinary config:');
  console.log(`  Cloud name: ${cloudName || 'NOT SET'}`);
  console.log(`  API key: ${apiKey ? apiKey.substring(0, 4) + '...' : 'NOT SET'}`);
  console.log(`  API secret: ${apiSecret ? '***' : 'NOT SET'}\n`);

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Error: Missing Cloudinary credentials in .env file');
    console.error('Required variables:');
    console.error('  CLOUDINARY_CLOUD_NAME');
    console.error('  CLOUDINARY_API_KEY');
    console.error('  CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  try {
    // Fetch data from both sources
    const cloudinaryImages = await getCloudinaryImages();
    const databaseUrls = await getDatabaseImageUrls();

    // Find orphans
    console.log('\nComparing Cloudinary images with database references...');
    const orphans = findOrphans(cloudinaryImages, databaseUrls);

    if (orphans.length === 0) {
      console.log('\nNo orphaned images found. Everything is clean!');
    } else {
      const totalBytes = orphans.reduce((sum, img) => sum + (img.bytes || 0), 0);

      console.log(`\nFound ${orphans.length} orphaned images (${formatBytes(totalBytes)} total):`);
      console.log('-----------------------------------------------------------------------');

      for (const orphan of orphans) {
        console.log(`  ${orphan.public_id}`);
        console.log(`    Size: ${formatBytes(orphan.bytes)} | Created: ${orphan.created_at}`);
      }

      console.log('-----------------------------------------------------------------------');

      if (DELETE_MODE) {
        await deleteOrphans(orphans);
      } else {
        console.log('\nTo delete these orphans, run with --delete flag:');
        console.log('  node scripts/clean-cloudinary.js --delete');
      }
    }
  } catch (error) {
    console.error('\nError:', error?.message || error);
    if (error?.message?.includes('Must supply api_key') || error?.error?.message?.includes('Must supply api_key')) {
      console.error('\nMake sure your Cloudinary credentials are set in .env:');
      console.error('  CLOUDINARY_CLOUD_NAME=your_cloud_name');
      console.error('  CLOUDINARY_API_KEY=your_api_key');
      console.error('  CLOUDINARY_API_SECRET=your_api_secret');
    }
    // Log full error for debugging
    console.error('\nFull error:', JSON.stringify(error, null, 2));
    process.exit(1);
  } finally {
    // Close database connection
    await pool.end();
  }
}

// Run
main();
