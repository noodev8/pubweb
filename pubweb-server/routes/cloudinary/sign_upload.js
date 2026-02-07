/*
=======================================================================
API Route: sign_upload
=======================================================================
Method: POST
Purpose: Generates a signed Cloudinary upload signature. Requires authentication.
         This allows the client to upload directly to Cloudinary with server-side
         control over transformations, folder, and other parameters.
=======================================================================
Request Payload:
{
  "folder": "pubweb/gallery"              // string, required — target folder in Cloudinary
}

Success Response:
{
  "return_code": "SUCCESS",
  "signature": "a1b2c3d4e5...",           // string, the upload signature
  "timestamp": 1707300000,                // integer, Unix timestamp used in signing
  "api_key": "518465...",                 // string, Cloudinary API key
  "cloud_name": "dnrevr0pi",             // string, Cloudinary cloud name
  "folder": "pubweb/gallery",            // string, the folder that was signed
  "transformation": "c_limit,w_2000,h_2000,q_auto" // string, the transformation applied on upload
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"INVALID_FOLDER"
"UNAUTHORIZED"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { verifyToken } = require('../../middleware/auth');

// Only allow uploads to these folders — prevents abuse
const ALLOWED_FOLDERS = ['pubweb/gallery', 'pubweb/menus', 'pubweb/menus/pdf'];

// Transformation applied at upload time to cap image size and optimise quality.
// This keeps stored images at a reasonable size, reducing storage costs permanently.
const UPLOAD_TRANSFORMATION = 'c_limit,w_2000,h_2000,q_auto';

router.post('/sign_upload', verifyToken, async (req, res) => {

  try {
    const { folder } = req.body;

    // Validate required fields
    if (!folder) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'folder is required'
      });
    }

    // Validate folder is in allowed list — prevents uploading to arbitrary locations
    if (!ALLOWED_FOLDERS.includes(folder)) {
      return res.json({
        return_code: 'INVALID_FOLDER',
        message: 'Upload folder is not allowed'
      });
    }

    // Generate a timestamp for the signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Build the parameters to sign.
    // Only image folders get the resize transformation — PDFs are left as-is.
    const isPdf = folder === 'pubweb/menus/pdf';
    const params = {
      timestamp,
      folder,
      ...(isPdf ? {} : { transformation: UPLOAD_TRANSFORMATION }),
    };

    // Generate the signature using our API secret
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json({
      return_code: 'SUCCESS',
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
      transformation: isPdf ? undefined : UPLOAD_TRANSFORMATION,
    });

  } catch (error) {
    console.error('sign_upload error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while generating upload signature'
    });
  }
});

module.exports = router;
