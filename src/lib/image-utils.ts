/**
 * Client-side image to WebP converter and validation utility
 */

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, PNG, and WebP images are supported.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Image size must be less than 5 MB.",
    };
  }

  return { valid: true };
}

export async function toWebP(file: File, maxSize = 800, quality = 0.85): Promise<Blob> {
  if (typeof window === "undefined") {
    throw new Error("toWebP must be executed in browser context");
  }

  // Attempt using modern createImageBitmap
  if ("createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not acquire 2D canvas context");
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      return new Promise((res, rej) => {
        canvas.toBlob(
          (b) => (b ? res(b) : rej(new Error("WebP conversion failed"))),
          "image/webp",
          quality
        );
      });
    } catch (e) {
      console.warn("createImageBitmap failed, using HTMLImageElement fallback:", e);
    }
  }

  // Fallback using HTMLImageElement
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        },
        "image/webp",
        quality
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image for conversion"));
    };
    img.src = URL.createObjectURL(file);
  });
}
