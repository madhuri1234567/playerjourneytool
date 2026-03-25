import type { MapPoint, PixelCoord, Dimensions } from "@/types/map";

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
 * Sort points by their journey order.
 */
export function sortByOrder(points: MapPoint[]): MapPoint[] {
  return [...points].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Build an SVG path `d` attribute from an ordered list of pixel coordinates.
 */
export function buildPathD(coords: PixelCoord[]): string {
  return coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");
}
