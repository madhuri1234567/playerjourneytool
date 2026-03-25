/** Core types for the player journey visualization */

export interface MapPoint {
  id: string;
  /** Normalized x coordinate (0–1) */
  x: number;
  /** Normalized y coordinate (0–1) */
  y: number;
  label?: string;
  order?: number;
}

export interface PixelCoord {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}
