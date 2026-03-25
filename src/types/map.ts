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

export interface PlayerData {
  players: Player[];
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
