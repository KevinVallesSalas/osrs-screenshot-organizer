// classification.js

/**
 * For folders where each file is unique.
 * Returns the folder name as the category with no subcategory.
 */
export function classifyUnique(fileName, folderName) {
    return { category: folderName, subcategory: null };
  }
  
  /**
   * For "Boss Kills": extract the boss name from the file name.
   * Assumes filenames like "Barrows(10) 2025-02-19_21-08-54.png"
   * and returns "Barrows" as the subcategory.
   */
  export function classifyBossKills(fileName) {
    const match = fileName.match(/^([^()]+)\(/);
    if (match) {
      return { category: "Boss Kills", subcategory: match[1].trim() };
    }
    return { category: "Boss Kills", subcategory: null };
  }
  
  /**
   * For "Chest Loot": extract the prefix before the date.
   * Assumes filenames like "The Gauntlet 2024-11-02_14-28-47.png"
   */
  export function classifyChestLoot(fileName) {
    const match = fileName.match(/^(.+?)\s*\d{4}-\d{2}-\d{2}/);
    if (match) {
      return { category: "Chest Loot", subcategory: match[1].trim() };
    }
    return { category: "Chest Loot", subcategory: null };
  }
  
  /**
   * For "Clue Scroll Rewards": extract the difficulty rating.
   * Assumes filenames start with one of the keywords: Beginner, Easy, Medium, Hard, Elite, Master.
   */
  export function classifyClueScrollRewards(fileName) {
    const match = fileName.match(/^(Beginner|Easy|Medium|Hard|Elite|Master)/i);
    if (match) {
      const difficulty =
        match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      return { category: "Clue Scroll Rewards", subcategory: difficulty };
    }
    return { category: "Clue Scroll Rewards", subcategory: null };
  }
  
  /**
   * For "Levels": extract the skill name from the beginning.
   * Assumes filenames like "Agility(61) 2024-09-10_16-14-45.png"
   */
  export function classifyLevels(fileName) {
    const match = fileName.match(/^([A-Za-z]+)/);
    if (match) {
      return { category: "Levels", subcategory: match[1] };
    }
    return { category: "Levels", subcategory: null };
  }
  
  /**
   * Map folder names to their classifier functions.
   * If a folder does not require grouping (unique file names), we use classifyUnique.
   */
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
    "Quests": classifyUnique
  };
  
  /**
   * Main classification function.
   * It checks if a folder-specific classifier exists; if not, it falls back to a default.
   */
  export function classifyFile(fileName, folderName) {
    const classifier = folderClassifiers[folderName.trim()];
    if (classifier) {
      // For functions like classifyUnique that need the folder name,
      // we pass both fileName and folderName.
      return classifier(fileName, folderName);
    }
    // Fallback: return folder name as category
    return { category: folderName, subcategory: null };
  }
  
  /**
   * Build a category map from an array of files.
   * Each file object in fileArray should have the following structure:
   * { fileEntry, fileName, folderName }
   * The returned map is an object in which each key is a category and the value is an object
   * mapping subcategories to an array of file entries.
   *
   * Example output:
   * {
   *   "Chest Loot": {
   *       "The Gauntlet": [ fileEntry, fileEntry, ... ],
   *       "Misc": [ fileEntry, ... ]
   *    },
   *   "Levels": {
   *       "Agility": [ fileEntry, ... ]
   *    }
   * }
   */
  export function buildCategoryMap(fileArray) {
    const map = {};
    fileArray.forEach(({ fileEntry, fileName, folderName }) => {
      const { category, subcategory } = classifyFile(fileName, folderName);
      if (!map[category]) {
        map[category] = {};
      }
      // Use "Misc" for null subcategories to keep a consistent key.
      const subcatKey = subcategory || "Misc";
      if (!map[category][subcatKey]) {
        map[category][subcatKey] = [];
      }
      map[category][subcatKey].push(fileEntry);
    });
    return map;
  }
  