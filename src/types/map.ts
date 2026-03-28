/** Core types for the player journey visualization */

export interface PathPoint {
  /** World x coordinate (raw, not normalized) */
  x: number;
  /** World z coordinate (raw, not normalized) */
  z: number;
  /** Timestamp — used to order the path (0-based seconds) */
  t: number;
}

export interface Player {
  id: string;
  is_bot: boolean;
  path: PathPoint[];
}

export type GameEventType = "kill" | "death" | "loot" | "storm_death";

export interface GameEvent {
  type: GameEventType;
  x: number;
  z: number;
  t: number;
  player_id: string;
}

export interface PlayerData {
  map?: string;
  match_id?: string;
  date?: string;
  players: Player[];
  events?: GameEvent[];
}

export interface PixelCoord {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

/** A player with a pre-assigned color for rendering */
export interface PlayerWithColor extends Player {
  color: string;
}

/** Layer visibility state */
export interface LayerVisibility {
  paths: boolean;
  events: boolean;
  heatmap: boolean;
}

/** Heatmap type */
export type HeatmapType = "movement" | "kills" | "deaths";

/** Map-specific coordinate config */
export interface MapConfig {
  scale: number;
  originX: number;
  originZ: number;
}

/** Match index entry */
export interface MatchIndexEntry {
  match_id: string;
  map: string;
  player_count: number;
  bot_count: number;
  duration: number;
  file: string;
}
