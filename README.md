# Player Journey Visualization Tool

A browser-based tool for LILA BLACK Level Designers to explore player movement, combat encounters, and map usage across 5 days of production telemetry data.

**🔗 Live Tool:** [playerjourneytool.lovable.app](https://playerjourneytool.lovable.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Visualization | Raw SVG overlays |
| Data | Pre-processed JSON (converted from Parquet at build time) |
| Hosting | Lovable (static deploy) |

---

## Run Locally

```bash
# Clone the repo
git clone <repo-url>
cd <repo-name>

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. No environment variables required — all data is bundled as static JSON files.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
├── public/
│   ├── data/
│   │   ├── matchIndex.json        # Index of all 796 matches (loaded on startup)
│   │   └── matches/               # Individual match JSON files (loaded on demand)
│   └── maps/                      # Minimap images for each map
├── src/
│   ├── components/                # React UI components
│   │   ├── map/                   # Map rendering (PlayerPath, EventOverlay, HeatmapOverlay)
│   │   └── ui/                    # shadcn/ui primitives
│   ├── hooks/                     # Custom hooks (useTimeline, useMatchData)
│   ├── lib/                       # Utilities (coordinate mapping, parsing, visualization)
│   └── types/                     # TypeScript type definitions
├── ARCHITECTURE.md                # Tech stack decisions & coordinate mapping approach
├── INSIGHTS.md                    # Three data-driven gameplay insights
└── WALKTHROUGH.md                 # Detailed feature walkthrough
```

---

## Feature Walkthrough

### 1. Loading Data

- Click **Load Data** in the toolbar to upload match files.
- Supports `.json` (pre-processed), `.nakama-0`, and `.parquet` files (auto-mapped to pre-converted data by match ID).
- Or simply use the filter dropdowns — all 796 matches are pre-loaded.

### 2. Filtering (Map / Date / Match)

Three cascading dropdowns in the toolbar:

| Filter | Behavior |
|--------|----------|
| **Map** | Narrows to matches on that map (AmbroseValley, Lockdown, GrandRift) |
| **Date** | Further narrows to a specific day (Feb 10–14) |
| **Match** | Selects one match — label shows short ID, player/bot count, and duration |

Changing a higher-level filter resets the ones below it.

### 3. Map Rendering & Coordinate Mapping

Each map has a dedicated minimap image and coordinate config. Raw world coordinates (`x`, `z`) are converted to pixel positions at render time:

```
pixelX = ((worldX - originX) / scale) × imageWidth
pixelY = (1 - (worldZ - originZ) / scale) × imageHeight
```

Full details in [ARCHITECTURE.md](./ARCHITECTURE.md).

### 4. Player Paths — Humans vs Bots

| Player Type | Visual Style |
|-------------|-------------|
| **Human** | Solid colored line |
| **Bot** | Dashed colored line + "bot" badge in the legend |

Bot detection uses the `is_bot` field from the match data. The **Player Legend** (bottom-left) shows each player's color, ID, and type.

### 5. Event Markers

Four event types rendered as distinct SVG icons at their world position:

| Event | Description |
|-------|-------------|
| **Kill** | Player eliminated another player |
| **Death** | Player was eliminated |
| **Loot** | Player picked up loot |
| **Storm Death** | Player died to the storm zone |

Events appear progressively as the timeline reaches their timestamp.

### 6. Timeline & Playback

The bottom bar controls match progression:

- **Play / Pause** — start/stop automatic playback
- **Slider** — scrub to any point; filled portion shows elapsed time
- **Speed controls** — 1×, 2×, 4× playback speed
- **Auto-reset** — selecting a new match resets playback to the beginning

Paths draw progressively and events appear as their timestamp is reached.

### 7. Heatmap Overlays

Toggle **Heatmap** in the top-right layer panel. Three modes:

| Mode | What it shows |
|------|---------------|
| **Movement** | High-traffic corridors and camping spots |
| **Kills** | Engagement hotspots and power positions |
| **Deaths** | Dangerous areas and choke points (includes storm deaths) |

### 8. Layer Controls

Top-right panel with three toggleable layers:

- **Paths** — player movement lines
- **Events** — kill, death, loot, storm markers
- **Heatmap** — density overlay with mode selector

Layers combine freely for different analysis views.

### 9. Map Interaction

- **Zoom** — scroll wheel or zoom button
- **Pan** — click and drag when zoomed in
- **Reset** — return to default view

---

## Documentation

| Document | Contents |
|----------|----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack choices, data pipeline, coordinate mapping formula, trade-offs |
| [INSIGHTS.md](./INSIGHTS.md) | Three gameplay insights with supporting data and actionable recommendations |
| [WALKTHROUGH.md](./WALKTHROUGH.md) | Detailed feature-by-feature guide |

---

## Data

- **796 matches** across 3 maps over 5 days (Feb 10–14, 2026)
- Pre-converted from 1,243 Parquet files (~10MB) to individual JSON files (~4.6MB)
- Match index loaded on startup; individual matches fetched on demand
