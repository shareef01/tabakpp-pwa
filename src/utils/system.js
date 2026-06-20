import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * TABAK++ SYSTEM UTILITIES
 * Core infrastructure helpers for UI merging, image processing, and error handling.
 */

/**
 * Standard Tailwind class merger.
 * Combines dynamic classes while resolving Tailwind conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Client-Side Image Compressor — returns JPEG Blob.
 */
export const compressImageToBlob = (file, maxWidth = 256, maxHeight = 256, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
        } else if (height > maxHeight) {
          width *= maxHeight / height; height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('COMPRESS_FAILED'))),
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

/** Returns base64 JPEG data URL for Firestore / Auth photoURL. */
export const compressImage = (file, maxWidth = 200, maxHeight = 200, quality = 0.75) =>
  compressImageToBlob(file, maxWidth, maxHeight, quality).then(
    (blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    })
  );

/**
 * Standardized Async Error Handler
 * Wraps async operations with consistent logging and fault tolerance.
 */
export const safeAsync = async (fn, label = 'OP_FAILURE') => {
  try {
    return await fn();
  } catch (err) {
    console.error(`[${label}]:`, err);
    return null;
  }
};
