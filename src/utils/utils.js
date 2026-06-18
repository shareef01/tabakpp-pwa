import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard Tailwind class merger.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Client-Side Image Compressor
 * Resizes an image to fit within max dimensions and returns a compressed base64 string.
 * This ensures we stay within Firestore's 1MB document limit.
 *
 * @param {File} file - The uploaded image file.
 * @param {number} maxWidth - Maximum allowed width.
 * @param {number} maxHeight - Maximum allowed height.
 * @returns {Promise<string>} - Compressed base64 string.
 */
export const compressImage = (file, maxWidth = 200, maxHeight = 200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Quality set to 0.7 for optimal size-to-clarity ratio
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
