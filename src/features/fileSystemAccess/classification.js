// classification.js (updated with IndexedDB caching)
import { getDB } from '../../database.js';

/** Existing classifier functions remain unchanged **/
export function classifyUnique(fileName, folderName) {
  return { category: folderName, subcategory: null };
}

export function classifyBossKills(fileName) {
  const match = fileName.match(/^([^()]+)\(/);
  return match
    ? { category: "Boss Kills", subcategory: match[1].trim() }
    : { category: "Boss Kills", subcategory: null };
}

export function classifyChestLoot(fileName) {
  const match = fileName.match(/^(.+?)\s*\d{4}-\d{2}-\d{2}/);
  return match
    ? { category: "Chest Loot", subcategory: match[1].trim() }
    : { category: "Chest Loot", subcategory: null };
}

export function classifyClueScrollRewards(fileName) {
  const match = fileName.match(/^(Beginner|Easy|Medium|Hard|Elite|Master)/i);
  if (match) {
    const difficulty =
      match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    return { category: "Clue Scroll Rewards", subcategory: difficulty };
  }
  return { category: "Clue Scroll Rewards", subcategory: null };
}

export function classifyLevels(fileName) {
  const match = fileName.match(/^([A-Za-z]+)/);
  return match
    ? { category: "Levels", subcategory: match[1] }
    : { category: "Levels", subcategory: null };
}

export const folderClassifiers = {
  "Lonesoldr": classifyUnique,
  "Boss Kills": classifyBossKills,
  "Chest Loot": classifyChestLoot,
  "Clue Scroll Rewards": classifyClueScrollRewards,
  "Collection Log": classifyUnique,
  "Combat Achievements": classifyUnique,
  "Kingdom Rewards": classifyUnique,
  "Levels": classifyLevels,
  "Pets": classifyUnique,
  "Quests": classifyUnique,
};

export function classifyFile(fileName, folderName) {
  const classifier = folderClassifiers[folderName.trim()];
  return classifier ? classifier(fileName, folderName) : { category: folderName, subcategory: null };
}

export function parseFileName(fileName) {
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  const match = withoutExt.match(/^(.+?)\s+(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})$/);
  if (match) {
    const [_, cleanedName, datePart, timePart] = match;
    const formattedDateStr = `${datePart}T${timePart.replace(/-/g, ':')}`; // ISO format
    const dateObj = new Date(formattedDateStr);
    return {
      cleanedName: cleanedName.trim(),
      dateStr: formattedDateStr, // ISO-formatted string
      dateObj,                  // actual Date object
    };
  }
  return {
    cleanedName: withoutExt,
    dateStr: null,
    dateObj: null,
  };
}

// IndexedDB Helpers
async function getClassificationFromCache(fileName) {
  const db = await getDB();
  return db.get('classifications', fileName);
}

async function storeClassificationInCache(classification) {
  const db = await getDB();
  await db.put('classifications', classification);
}

// Cached classification function
export async function classifyFileCached(fileName, folderName) {
  const cached = await getClassificationFromCache(fileName);
  if (cached) return cached;

  const { category, subcategory } = classifyFile(fileName, folderName);
  const { cleanedName, dateStr, dateObj } = parseFileName(fileName);

  const classification = { 
    fileName, folderName, category, subcategory, cleanedName, dateStr, date: dateObj 
  };

  await storeClassificationInCache(classification);

  return classification;
}

// Build a cached category map
export async function buildCategoryMapCached(fileArray) {
  const map = {};

  await Promise.all(fileArray.map(async ({ fileEntry, fileName, folderName }) => {
    const classification = await classifyFileCached(fileName, folderName);

    if (!map[classification.category]) {
      map[classification.category] = {};
    }

    const subcatKey = classification.subcategory || "Misc";

    if (!map[classification.category][subcatKey]) {
      map[classification.category][subcatKey] = [];
    }

    map[classification.category][subcatKey].push({
      fileEntry,
      fileName,
      cleanedName: classification.cleanedName,
      dateStr: classification.dateStr,
      folderName,
    });
  }));

  return map;
}
