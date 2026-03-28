import type { PlayerData } from "@/types/map";

/**
 * Fallback sample data using AmbroseValley raw world coordinates.
 * Used when no match data is loaded.
 */
const sampleData: PlayerData = {
  map: "AmbroseValley",
  match_id: "sample_001",
  players: [
    {
      id: "sample_player",
      is_bot: false,
      path: [
        { x: -170, z: 330, t: 0 },
        { x: -150, z: 300, t: 50 },
        { x: -120, z: 260, t: 100 },
        { x: -80, z: 200, t: 150 },
        { x: -30, z: 140, t: 200 },
        { x: 40, z: 80, t: 250 },
        { x: 100, z: 20, t: 300 },
        { x: 160, z: -40, t: 350 },
      ],
    },
  ],
  events: [
    { type: "loot", x: -150, z: 300, t: 50, player_id: "sample_player" },
    { type: "kill", x: -30, z: 140, t: 200, player_id: "sample_player" },
    { type: "loot", x: 40, z: 80, t: 250, player_id: "sample_player" },
  ],
};

export default sampleData;
