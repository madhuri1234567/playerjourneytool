# Feature Walkthrough

A guided tour of every major feature in the Player Journey Visualization Tool.

---

## 1. Loading Match Data

- Click **Load Data** in the top toolbar to upload a match file.
- Supported formats: `.json` (pre-processed match data) and `.nakama-0` / `.parquet` (auto-mapped to converted JSON by match ID).
- On load, the map image, player paths, and events render immediately.

---

## 2. Filtering (Map / Date / Match)

Three cascading dropdown filters sit in the top toolbar:

| Filter | Behavior |
|--------|----------|
| **Map** | Narrows to matches played on that map (AmbroseValley, Lockdown, GrandRift). |
| **Date** | Further narrows to a specific day (Feb 10–14, 2026 in the sample data). |
| **Match** | Selects one match. The label shows a short ID, player/bot count, and duration. |

Filters are cascading — changing the map resets date and match selections. Changing the date resets the match selection.

---

## 3. Map Rendering & Coordinate Mapping

Each map has a dedicated background image and a coordinate configuration that maps raw world coordinates (`x`, `z`) to pixel positions on the image.

The formula (detailed in `ARCHITECTURE.md`):

```
pixelX = ((worldX - originX) / rangeX) * imageWidth
pixelY = ((worldZ - originZ) / rangeZ) * imageHeight
```

Player paths and event markers are rendered as SVG elements overlaid on the map image, giving pixel-perfect control without a heavy charting library.

---

## 4. Player Paths & Bot vs Human Distinction

Every player's movement is drawn as a colored polyline on the map.

| Player Type | Visual Style |
|-------------|-------------|
| **Human** | **Solid line** — smooth, continuous stroke |
| **Bot** | **Dashed line** (`strokeDasharray="8 5"`) — clearly distinct from human paths |

The **Player Legend** (bottom-left of the map) lists each player with:
- A colored line sample matching their path
- Their truncated player ID
- A **"bot"** badge for bot players

Bot detection is based on the `is_bot` boolean field in the match JSON data.

---

## 5. Event Markers

Four event types are rendered as distinct SVG icons on the map at the location and time they occurred:

| Event | Icon | Description |
|-------|------|-------------|
| **Kill** | Crosshair | Player eliminated another player |
| **Death** | Skull / X | Player was eliminated |
| **Loot** | Package | Player picked up loot |
| **Storm Death** | Cloud / lightning | Player died to the storm zone |

Events are tied to the timeline — they appear only when the playback reaches their timestamp. Toggle event visibility using the **Events** layer toggle in the top-right control panel.

---

## 6. Timeline & Playback

The timeline bar at the bottom of the map controls match progression:

- **Play / Pause** button starts or stops automatic playback.
- **Slider** scrubs to any point in the match. The filled portion shows elapsed time.
- **Speed controls** (1×, 2×, 4×) adjust playback speed.
- **Time display** shows current time / total duration in seconds.

**Auto-reset:** When you select a new match (or change map/date filters), playback automatically resets to the beginning — no need to manually drag the slider back.

Paths draw progressively up to the current time, and event markers appear as their timestamp is reached.

---

## 7. Heatmaps

Toggle the **Heatmap** layer in the top-right control panel to overlay density visualizations. Three modes are available:

| Mode | What it shows |
|------|---------------|
| **Movement** | Where players spend the most time — highlights high-traffic corridors and camping spots. |
| **Kills** | Where eliminations cluster — reveals dominant engagement zones and power positions. |
| **Deaths** | Where players die most often (includes storm deaths) — exposes dangerous areas and choke points. |

The heatmap uses a grid-based density calculation over world coordinates, rendered as semi-transparent colored cells. Hot zones appear in warm colors (red/orange), cold zones in cool colors or are invisible.

---

## 8. Layer Controls

The top-right overlay panel provides three toggleable layers:

- **Paths** — Show/hide all player movement lines
- **Events** — Show/hide kill, death, loot, and storm markers
- **Heatmap** — Show/hide the heatmap overlay (with sub-options for movement/kills/deaths)

Layers can be combined freely — for example, enable heatmap + events but hide paths to focus on engagement patterns without visual clutter.

---

## 9. Map Interaction

- **Zoom** — Use the zoom button or scroll wheel to zoom into areas of interest.
- **Pan** — Click and drag to pan around the map when zoomed in.
- **Reset** — Click the reset button to return to the default view.

---

## Summary

| Feature | Where to find it |
|---------|-----------------|
| Load data | Top toolbar — "Load Data" button |
| Filter matches | Top toolbar — Map, Date, Match dropdowns |
| Player legend | Bottom-left overlay on the map |
| Layer toggles | Top-right overlay on the map |
| Timeline playback | Bottom bar beneath the map |
| Heatmap modes | Top-right overlay → Heatmap sub-options |
| Zoom / Pan / Reset | Map interaction + top-left buttons |
