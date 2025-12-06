// src/services/storage.ts
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

/**
 * Resolve an array of image path strings (Storage paths or already-formed URLs)
 * into an array of usable image URLs. Supports:
 * - Full URLs (http/https)
 * - Hosting-relative paths (/images/...)
 * - Relative paths (images/mdl-029.jpg)
 * - Firebase Storage paths (images/MDL-003/...)
 */
export async function resolveImagePaths(paths?: string[]) {
  if (!paths || !Array.isArray(paths)) return [];

  return Promise.all(
    paths.map(async (p) => {
      if (!p) return "/images/no-image.png";
      
      // already a full URL (http/https)
      if (/^https?:\/\//i.test(p)) return p;
      
      // already a hosting-relative path starting with /
      if (p.startsWith("/")) return p;
      
      // relative path like "images/mdl-029.jpg" - convert to /images/mdl-029.jpg
      if (p.startsWith("images/") && !p.includes("/") && p.endsWith(".jpg")) {
        return "/" + p;
      }

      // Try to resolve as Firebase Storage path (e.g., "images/MDL-003/..." or "images/mdl-029.jpg")
      try {
        const url = await getDownloadURL(ref(storage, p));
        return url;
      } catch (storageError) {
        // If Firebase Storage fails, try as relative hosting path
        if (!p.startsWith("/")) {
          return "/" + p;
        }
        return "/images/no-image.png";
      }
    })
  );
}

export default { resolveImagePaths };
