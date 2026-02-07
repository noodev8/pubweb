import type { ImageLoaderProps } from 'next/image';

/**
 * Next.js Image loader for Cloudinary URLs.
 * Inserts f_auto, q_auto, and width-based resizing so the browser
 * downloads the smallest appropriate variant for its viewport.
 */
export function cloudinaryLoader({ src, width }: ImageLoaderProps): string {
  if (!src.includes('res.cloudinary.com')) return src;
  return src.replace(
    '/upload/',
    `/upload/f_auto,q_auto,c_limit,w_${width}/`
  );
}
