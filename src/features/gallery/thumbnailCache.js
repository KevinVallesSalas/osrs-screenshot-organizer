import { openDB } from 'idb';
import { createThumbnail } from './thumbnailHelper.js';

// 1. Open or create the IndexedDB database
const dbPromise = openDB('osrs-thumbnails', 1, {
  upgrade(db) {
    // Create an object store named 'thumbnails' if it doesn't exist
    if (!db.objectStoreNames.contains('thumbnails')) {
      db.createObjectStore('thumbnails');
    }
  },
});

// 2. Helper to retrieve a thumbnail from the cache
async function getThumbnailFromCache(key) {
  const db = await dbPromise;
  return db.get('thumbnails', key);
}

// 3. Helper to store a thumbnail in the cache
async function storeThumbnailInCache(key, dataURL) {
  const db = await dbPromise;
  await db.put('thumbnails', dataURL, key);
}

/**
 * Checks the cache for a thumbnail of the given file.
 * If not found, generates a new one and stores it.
 * @param {FileSystemFileHandle} fileEntry
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @returns {string|null} - Data URL of the thumbnail, or null if an error occurred.
 */
export async function getCachedThumbnail(fileEntry, maxWidth = 200, maxHeight = 200) {
  try {
    // Obtain an actual File from the file handle
    const file = await fileEntry.getFile();

    // Create a unique key based on file name, size, and lastModified
    // so we don't regenerate the same thumbnail repeatedly.
    const key = `${file.name}_${file.lastModified}_${file.size}_${maxWidth}x${maxHeight}`;

    // 1. Check if the thumbnail is already cached
    const cached = await getThumbnailFromCache(key);
    if (cached) {
      return cached;
    }

    // 2. Not in cache; generate a new thumbnail
    const thumbnailDataURL = await createThumbnail(fileEntry, maxWidth, maxHeight);
    if (thumbnailDataURL) {
      // Store it in IndexedDB
      await storeThumbnailInCache(key, thumbnailDataURL);
    }

    return thumbnailDataURL;
  } catch (error) {
    console.error('Error generating or caching thumbnail:', error);
    return null;
  }
}
