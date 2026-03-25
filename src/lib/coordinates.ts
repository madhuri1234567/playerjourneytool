export interface MapPoint {
  id: string;
  x: number; // normalized 0-1
  y: number; // normalized 0-1
  label?: string;
  order?: number;
}

/**
 * Convert normalized world coordinates (0-1) to pixel coordinates
 * based on the rendered image dimensions.
 */
export function worldToImage(
  normalizedX: number,
  normalizedY: number,
  imageWidth: number,
  imageHeight: number
): { x: number; y: number } {
  return {
    x: normalizedX * imageWidth,
    y: normalizedY * imageHeight,
  };
}

export const SAMPLE_JOURNEY: MapPoint[] = [
  { id: "spawn", x: 0.12, y: 0.75, label: "Spawn Point", order: 1 },
  { id: "forest", x: 0.25, y: 0.55, label: "Dark Forest", order: 2 },
  { id: "river", x: 0.38, y: 0.42, label: "River Crossing", order: 3 },
  { id: "village", x: 0.55, y: 0.58, label: "Village", order: 4 },
  { id: "castle", x: 0.62, y: 0.28, label: "Castle", order: 5 },
  { id: "peak", x: 0.82, y: 0.18, label: "Mountain Peak", order: 6 },
];
