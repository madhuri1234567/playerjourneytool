import type { PlayerData } from "@/types/map";

const sampleData: PlayerData = {
  players: [
    {
      id: "player_1",
      is_bot: false,
      path: [
        { x: 0.10, y: 0.80, t: 0 },
        { x: 0.15, y: 0.70, t: 1 },
        { x: 0.22, y: 0.58, t: 2 },
        { x: 0.30, y: 0.50, t: 3 },
        { x: 0.40, y: 0.45, t: 4 },
        { x: 0.50, y: 0.50, t: 5 },
        { x: 0.58, y: 0.42, t: 6 },
        { x: 0.65, y: 0.30, t: 7 },
      ],
    },
    {
      id: "player_2",
      is_bot: false,
      path: [
        { x: 0.85, y: 0.85, t: 0 },
        { x: 0.78, y: 0.75, t: 1 },
        { x: 0.70, y: 0.65, t: 2 },
        { x: 0.62, y: 0.58, t: 3 },
        { x: 0.55, y: 0.55, t: 4 },
        { x: 0.48, y: 0.48, t: 5 },
      ],
    },
    {
      id: "bot_scout",
      is_bot: true,
      path: [
        { x: 0.50, y: 0.10, t: 0 },
        { x: 0.45, y: 0.20, t: 1 },
        { x: 0.40, y: 0.30, t: 2 },
        { x: 0.38, y: 0.40, t: 3 },
        { x: 0.35, y: 0.55, t: 4 },
        { x: 0.30, y: 0.65, t: 5 },
        { x: 0.25, y: 0.75, t: 6 },
      ],
    },
    {
      id: "bot_patrol",
      is_bot: true,
      path: [
        { x: 0.70, y: 0.15, t: 0 },
        { x: 0.75, y: 0.25, t: 1 },
        { x: 0.80, y: 0.35, t: 2 },
        { x: 0.78, y: 0.45, t: 3 },
        { x: 0.72, y: 0.52, t: 4 },
        { x: 0.68, y: 0.60, t: 5 },
      ],
    },
  ],
};

export default sampleData;
