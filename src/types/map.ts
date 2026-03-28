/** Core types for the player journey visualization */

export interface PathPoint {
  /** Normalized x coordinate (0–1) */
  x: number;
  /** Normalized y coordinate (0–1) */
  y: number;
  /** Timestamp — used to order the path */
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
  y: number;
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
