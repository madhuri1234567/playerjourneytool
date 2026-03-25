import type { PlayerData } from "@/types/map";

/**
 * Parse and validate a JSON string as PlayerData.
 * Throws descriptive errors on invalid input.
 */
export function parsePlayerJson(jsonString: string): PlayerData {
  const raw = JSON.parse(jsonString);

  if (!raw || !Array.isArray(raw.players)) {
    throw new Error("JSON must contain a \"players\" array.");
  }

  for (const player of raw.players) {
    if (typeof player.id !== "string") {
      throw new Error("Each player must have a string \"id\".");
    }
    if (typeof player.is_bot !== "boolean") {
      throw new Error(`Player "${player.id}": "is_bot" must be a boolean.`);
    }
    if (!Array.isArray(player.path) || player.path.length === 0) {
      throw new Error(`Player "${player.id}": "path" must be a non-empty array.`);
    }
    for (const pt of player.path) {
      if (typeof pt.x !== "number" || typeof pt.y !== "number" || typeof pt.t !== "number") {
        throw new Error(`Player "${player.id}": each path point must have numeric x, y, t.`);
      }
    }
  }

  return raw as PlayerData;
}
