/*
=======================================================================
Cloudinary Utility
=======================================================================
Helper functions for server-side Cloudinary operations.
Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET env vars.
=======================================================================
*/

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The Cloudinary public_id of the image
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok' || result.result === 'not found') {
      return { success: true };
    }
    return { success: false, error: `Cloudinary returned: ${result.result}` };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Extract a Cloudinary public_id from a full URL.
 * Handles URLs with or without version numbers.
 *
 * Example: https://res.cloudinary.com/xxx/image/upload/v123/pubweb/gallery/abc.jpg
 * Returns: pubweb/gallery/abc
 *
 * @param {string} url - The full Cloudinary URL
 * @returns {string|null} The public_id, or null if extraction fails
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

module.exports = {
  deleteImage,
  extractPublicId,
};
