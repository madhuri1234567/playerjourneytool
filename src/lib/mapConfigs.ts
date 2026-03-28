import type { MapConfig } from "@/types/map";

import ambroseImg from "@/assets/AmbroseValley_Minimap.png";
import grandRiftImg from "@/assets/GrandRift_Minimap.png";
import lockdownImg from "@/assets/Lockdown_Minimap.jpg";

/** Per-map coordinate mapping configs */
export const MAP_CONFIGS: Record<string, MapConfig> = {
  AmbroseValley: { scale: 900, originX: -370, originZ: -473 },
  GrandRift:     { scale: 581, originX: -290, originZ: -290 },
  Lockdown:      { scale: 1000, originX: -500, originZ: -500 },
};

/** Per-map minimap image imports */
export const MAP_IMAGES: Record<string, string> = {
  AmbroseValley: ambroseImg,
  GrandRift: grandRiftImg,
  Lockdown: lockdownImg,
};

/** Fallback to AmbroseValley for unknown maps */
export function getMapConfig(mapId: string): MapConfig {
  return MAP_CONFIGS[mapId] ?? MAP_CONFIGS.AmbroseValley;
}

export function getMapImage(mapId: string): string {
  return MAP_IMAGES[mapId] ?? MAP_IMAGES.AmbroseValley;
}
