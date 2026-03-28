import type { PathPoint, PixelCoord, Dimensions, GameEvent, HeatmapType } from "@/types/map";

/**
 * Convert normalized world coordinates (0–1) to pixel coordinates
 * relative to the rendered image dimensions.
 */
export function worldToPixel(
  normalizedX: number,
  normalizedY: number,
  dimensions: Dimensions
): PixelCoord {
  return {
    x: normalizedX * dimensions.width,
    y: normalizedY * dimensions.height,
  };
}

/**
 * Sort path points by timestamp ascending.
 */
export function sortByTimestamp(points: PathPoint[]): PathPoint[] {
  return [...points].sort((a, b) => a.t - b.t);
}

/**
 * Build an SVG path `d` attribute from an ordered list of pixel coordinates.
 */
export function buildPathD(coords: PixelCoord[]): string {
  if (coords.length === 0) return "";
  return coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");
}

/**
 * Distinct, high-contrast player colors (HSL strings).
 */
const PLAYER_COLORS = [
  "hsl(200, 90%, 55%)",
  "hsl(350, 85%, 58%)",
  "hsl(140, 70%, 48%)",
  "hsl(45, 95%, 55%)",
  "hsl(280, 75%, 60%)",
  "hsl(170, 80%, 45%)",
  "hsl(20, 90%, 55%)",
  "hsl(320, 70%, 55%)",
];

export function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

/** Get the time range across all player paths and events. */
export function getTimeRange(
  paths: PathPoint[][],
  events: GameEvent[] = []
): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const path of paths) {
    for (const pt of path) {
      if (pt.t < min) min = pt.t;
      if (pt.t > max) max = pt.t;
    }
  }
  for (const evt of events) {
    if (evt.t < min) min = evt.t;
    if (evt.t > max) max = evt.t;
  }
  if (min === Infinity) return { min: 0, max: 0 };
  return { min, max };
}

/** Filter path points up to a given time, returning sorted subset. */
export function pathUpToTime(path: PathPoint[], time: number): PathPoint[] {
  return sortByTimestamp(path).filter((pt) => pt.t <= time);
}

/** ── Heatmap helpers ── */

const GRID_SIZE = 32; // number of cells per axis

export interface HeatCell {
  row: number;
  col: number;
  value: number;       // raw count
  intensity: number;   // 0–1 normalized
}

export function buildHeatmap(
  type: HeatmapType,
  paths: PathPoint[][],
  events: GameEvent[]
): HeatCell[] {
  const grid: number[][] = Array.from({ length: GRID_SIZE }, () =>
    new Array(GRID_SIZE).fill(0)
  );

  if (type === "movement") {
    for (const path of paths) {
      for (const pt of path) {
        const col = Math.min(Math.floor(pt.x * GRID_SIZE), GRID_SIZE - 1);
        const row = Math.min(Math.floor(pt.y * GRID_SIZE), GRID_SIZE - 1);
        grid[row][col]++;
      }
    }
  } else {
    const filterType = type === "kills" ? "kill" : "death";
    for (const evt of events) {
      if (evt.type === filterType || (type === "deaths" && evt.type === "storm_death")) {
        const col = Math.min(Math.floor(evt.x * GRID_SIZE), GRID_SIZE - 1);
        const row = Math.min(Math.floor(evt.y * GRID_SIZE), GRID_SIZE - 1);
        grid[row][col]++;
      }
    }
  }

  let maxVal = 0;
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
      if (grid[r][c] > maxVal) maxVal = grid[r][c];

  const cells: HeatCell[] = [];
  if (maxVal === 0) return cells;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] > 0) {
        cells.push({
          row: r,
          col: c,
          value: grid[r][c],
          intensity: grid[r][c] / maxVal,
        });
      }
    }
  }
  return cells;
}

/** Map intensity 0–1 to a blue→red HSL color string. */
export function heatColor(intensity: number): string {
  // 240 (blue) → 0 (red)
  const hue = 240 - intensity * 240;
  return `hsl(${hue}, 85%, 50%)`;
}

export const HEAT_GRID_SIZE = GRID_SIZE;
