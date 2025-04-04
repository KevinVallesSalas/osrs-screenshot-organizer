import { openDB } from 'idb';

const DB_NAME = 'osrs-screenshots-db';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('thumbnails')) {
      db.createObjectStore('thumbnails');
    }
    if (!db.objectStoreNames.contains('classifications')) {
      db.createObjectStore('classifications', { keyPath: 'fileName' });
    }
  },
});

// Export a simple getter for the DB instance
export function getDB() {
  return dbPromise;
}
