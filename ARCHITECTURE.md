# Architecture

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React + TypeScript + Vite | Fast iteration, type safety, instant HMR. React's component model maps naturally to layered map visualization. |
| Styling | Tailwind CSS + shadcn/ui | Utility-first CSS for rapid UI building. shadcn provides accessible, themeable primitives. |
| Visualization | Raw SVG | No heavy charting library needed. SVG gives pixel-perfect control over paths, markers, and overlays with native browser rendering. |
| Data | Pre-processed JSON (from Parquet) | Client-side Parquet parsing adds ~500KB of WASM. Pre-converting during build keeps the runtime lean and load times fast. |
| Hosting | Lovable (Vite static deploy) | Zero-config deployment with shareable URL. |

## Data Flow

```
Parquet files (1,243 files, ~10MB)
  ↓ Python conversion script (build-time)
  ↓ Group by match_id, extract paths, map events, normalize timestamps
JSON files (796 matches, ~4.6MB in public/data/)
  ↓ matchIndex.json loaded on app start
  ↓ Individual match JSON fetched on-demand
React app renders:
  ↓ Raw world coords (x, z) → worldToPixel(x, z, mapConfig, imageDimensions)
  ↓ SVG paths, event markers, heatmap grid
Browser display
```

## Coordinate Mapping

This was the trickiest part. Each map has a different coordinate system:

| Map | Scale | Origin (X, Z) |
|-----|-------|----------------|
| AmbroseValley | 900 | (-370, -473) |
| GrandRift | 581 | (-290, -290) |
| Lockdown | 1000 | (-500, -500) |

**Conversion formula:**
```
u = (world_x - origin_x) / scale        → normalized [0, 1]
v = 1 - (world_z - origin_z) / scale    → normalized [0, 1], Y-flipped
pixel_x = u × image_width
pixel_y = v × image_height
```

The Y-flip is needed because game world Z+ is "up" (north), but image pixel Y+ is "down". I store raw world coordinates in JSON and apply the conversion at render time in `worldToPixel()`, making the mapping explicit and debuggable.

**Validation:** I overlaid all 9 initial player paths onto the AmbroseValley minimap using Python/Pillow and confirmed paths follow roads and buildings before building the frontend.

## Key Decisions & Trade-offs

| Decision | Alternative | Why I chose this |
|----------|-------------|------------------|
| Pre-convert Parquet → JSON | Client-side Parquet parsing with parquet-wasm | Keeps bundle small (~0 vs ~500KB), faster load, simpler code. Trade-off: requires build step for new data. |
| One JSON per match | Aggregate by day or bundle all data | Lazy loading — only fetch the match you're viewing. 796 small files vs one 4.6MB blob. |
| Raw SVG for visualization | Canvas, D3, or Leaflet | Full control over markers, no library overhead. SVG handles 50-player matches fine. Would hit limits at 500+ concurrent paths. |
| Map config at render time | Pre-normalize coords in JSON | Keeps raw data inspectable, makes coordinate bugs visible, supports future map config tweaks without reconverting data. |
| `useMemo` + `React.memo` | No optimization | Critical for timeline playback — prevents full SVG re-render every animation frame. |

## What I'd Do With More Time

1. **Zoom & pan** — Using a transform matrix on the SVG for dense map inspection
2. **Cross-match analytics** — Aggregate heatmaps across all matches for a date/map, not just single matches
3. **Player search** — Find a specific player's matches across all 5 days
4. **WebSocket live data** — Stream position events in real-time during active matches
5. **Canvas renderer** — Switch from SVG to Canvas for matches with 100+ players
