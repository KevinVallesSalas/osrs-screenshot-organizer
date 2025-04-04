import { getDB } from '../../database.js';
import { createThumbnail } from './thumbnailHelper.js';

// Helper: Retrieve thumbnail from cache
async function getThumbnailFromCache(key) {
  const db = await getDB();
  return db.get('thumbnails', key);
}

// Helper: Store thumbnail in cache
async function storeThumbnailInCache(key, dataURL) {
  const db = await getDB();
  await db.put('thumbnails', dataURL, key);
}

// Main function remains unchanged, except DB logic
export async function getCachedThumbnail(fileEntry, maxWidth = 200, maxHeight = 200) {
  try {
    const file = await fileEntry.getFile();
    const key = `${file.name}_${file.lastModified}_${file.size}_${maxWidth}x${maxHeight}`;

    const cached = await getThumbnailFromCache(key);
    if (cached) {
      return cached;
    }

    const thumbnailDataURL = await createThumbnail(fileEntry, maxWidth, maxHeight);
    if (thumbnailDataURL) {
      await storeThumbnailInCache(key, thumbnailDataURL);
    }

    return thumbnailDataURL;
  } catch (error) {
    console.error('Error generating or caching thumbnail:', error);
    return null;
  }
}
