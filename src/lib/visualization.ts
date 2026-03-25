import type { PathPoint, PixelCoord, Dimensions } from "@/types/map";

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
 * Designed to remain visible on the earthy minimap palette.
 */
const PLAYER_COLORS = [
  "hsl(200, 90%, 55%)",  // bright blue
  "hsl(350, 85%, 58%)",  // red-pink
  "hsl(140, 70%, 48%)",  // green
  "hsl(45, 95%, 55%)",   // amber
  "hsl(280, 75%, 60%)",  // purple
  "hsl(170, 80%, 45%)",  // teal
  "hsl(20, 90%, 55%)",   // orange
  "hsl(320, 70%, 55%)",  // magenta
];

/**
 * Get a deterministic color for a player based on their index.
 */
export function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
