/**
 * Cloudinary URL optimisation utilities.
 *
 * Inserts delivery transformations (auto-format, auto-quality, width cap)
 * into Cloudinary URLs to reduce bandwidth and improve load times.
 * Cloudinary caches each transformed variant on its CDN after the first
 * request, so subsequent requests incur no additional transformation cost.
 */

import type { ImageLoaderProps } from 'next/image'

/**
 * Transform a Cloudinary URL to include auto-format, auto-quality, and a width cap.
 * Non-Cloudinary URLs are returned unchanged.
 *
 * @param url - The original Cloudinary image URL
 * @param width - Maximum width in pixels (default 1200)
 * @returns The optimised URL with f_auto,q_auto,c_limit,w_{width} inserted
 */
export function optimisedUrl(url: string, width: number = 1200): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  // Insert transforms between /upload/ and the version/public_id
  return url.replace(
    '/upload/',
    `/upload/f_auto,q_auto,c_limit,w_${width}/`
  );
}

/**
 * Next.js Image loader for Cloudinary URLs.
 * Generates responsive srcSet automatically — the browser picks the best
 * width for the viewport, so mobile users download smaller images.
 * Non-Cloudinary URLs are returned as-is.
 */
export function cloudinaryLoader({ src, width }: ImageLoaderProps): string {
  if (!src.includes('res.cloudinary.com')) return src;
  return src.replace(
    '/upload/',
    `/upload/f_auto,q_auto,c_limit,w_${width}/`
  );
}
