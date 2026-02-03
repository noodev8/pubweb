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

module.exports = {
  deleteImage,
};
