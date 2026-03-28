import type { PlayerData, GameEventType } from "@/types/map";

const VALID_EVENT_TYPES: GameEventType[] = ["kill", "death", "loot", "storm_death"];

/**
 * Parse and validate a JSON string as PlayerData.
 * Supports raw world coordinates (x, z) in paths and events.
 */
export function parsePlayerJson(jsonString: string): PlayerData {
  const raw = JSON.parse(jsonString);

  if (!raw || !Array.isArray(raw.players)) {
    throw new Error('JSON must contain a "players" array.');
  }

  for (const player of raw.players) {
    if (typeof player.id !== "string") {
      throw new Error('Each player must have a string "id".');
    }
    if (typeof player.is_bot !== "boolean") {
      throw new Error(`Player "${player.id}": "is_bot" must be a boolean.`);
    }
    if (!Array.isArray(player.path) || player.path.length === 0) {
      throw new Error(`Player "${player.id}": "path" must be a non-empty array.`);
    }
    for (const pt of player.path) {
      if (typeof pt.x !== "number" || typeof pt.z !== "number" || typeof pt.t !== "number") {
        throw new Error(`Player "${player.id}": each path point must have numeric x, z, t.`);
      }
    }
  }

  if (raw.events !== undefined) {
    if (!Array.isArray(raw.events)) {
      throw new Error('"events" must be an array if provided.');
    }
    for (const evt of raw.events) {
      if (!VALID_EVENT_TYPES.includes(evt.type)) {
        throw new Error(`Event type "${evt.type}" is invalid. Must be one of: ${VALID_EVENT_TYPES.join(", ")}`);
      }
      if (typeof evt.x !== "number" || typeof evt.z !== "number" || typeof evt.t !== "number") {
        throw new Error("Each event must have numeric x, z, t.");
      }
      if (typeof evt.player_id !== "string") {
        throw new Error('Each event must have a string "player_id".');
      }
    }
  }

  if (raw.map !== undefined && typeof raw.map !== "string") {
    throw new Error('"map" must be a string if provided.');
  }
  if (raw.match_id !== undefined && typeof raw.match_id !== "string") {
    throw new Error('"match_id" must be a string if provided.');
  }

  return raw as PlayerData;
}
