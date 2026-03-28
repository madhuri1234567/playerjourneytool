import { useMemo, useState, useCallback } from "react";
import type { GameEvent, Dimensions, PlayerWithColor, GameEventType } from "@/types/map";
import { worldToPixel } from "@/lib/visualization";

interface EventOverlayProps {
  events: GameEvent[];
  dimensions: Dimensions;
  currentTime: number;
  hiddenPlayerIds: Set<string>;
}

const EVENT_LABELS: Record<GameEventType, string> = {
  kill: "Kill",
  death: "Death",
  loot: "Loot",
  storm_death: "Storm Death",
};

/** Renders event markers on the SVG. */
const EventOverlay = ({ events, dimensions, currentTime, hiddenPlayerIds }: EventOverlayProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const visibleEvents = useMemo(
    () =>
      events.filter(
        (e) => e.t <= currentTime && !hiddenPlayerIds.has(e.player_id)
      ),
    [events, currentTime, hiddenPlayerIds]
  );

  const handleMouseEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleMouseLeave = useCallback(() => setHoveredIndex(null), []);

  return (
    <>
      {visibleEvents.map((evt, i) => {
        const pos = worldToPixel(evt.x, evt.y, dimensions);
        const isHovered = hoveredIndex === i;
        return (
          <g
            key={`${evt.player_id}-${evt.type}-${evt.t}-${i}`}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "pointer" }}
          >
            <EventShape type={evt.type} x={pos.x} y={pos.y} />
            {isHovered && (
              <EventTooltip
                label={`${EVENT_LABELS[evt.type]} • t=${evt.t}`}
                x={pos.x}
                y={pos.y}
                svgWidth={dimensions.width}
              />
            )}
          </g>
        );
      })}
    </>
  );
};

/** Draws an SVG shape based on event type. */
function EventShape({ type, x, y }: { type: GameEventType; x: number; y: number }) {
  const size = 6;

  switch (type) {
    case "kill":
      // Crosshair
      return (
        <g>
          <circle cx={x} cy={y} r={size} fill="none" stroke="hsl(0, 85%, 60%)" strokeWidth={1.5} />
          <line x1={x - size} y1={y} x2={x + size} y2={y} stroke="hsl(0, 85%, 60%)" strokeWidth={1.5} />
          <line x1={x} y1={y - size} x2={x} y2={y + size} stroke="hsl(0, 85%, 60%)" strokeWidth={1.5} />
        </g>
      );
    case "death":
      // Circle with X
      return (
        <g>
          <circle cx={x} cy={y} r={size} fill="hsl(0, 0%, 20%)" stroke="hsl(0, 70%, 50%)" strokeWidth={1.5} />
          <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y + 3} stroke="hsl(0, 70%, 50%)" strokeWidth={1.5} />
          <line x1={x + 3} y1={y - 3} x2={x - 3} y2={y + 3} stroke="hsl(0, 70%, 50%)" strokeWidth={1.5} />
        </g>
      );
    case "loot":
      // Diamond
      return (
        <polygon
          points={`${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`}
          fill="hsl(45, 95%, 55%)"
          stroke="hsl(45, 90%, 40%)"
          strokeWidth={1}
          opacity={0.9}
        />
      );
    case "storm_death":
      // Lightning bolt
      return (
        <polygon
          points={`${x - 2},${y - size} ${x + 3},${y - 1} ${x},${y} ${x + 2},${y + size} ${x - 3},${y + 1} ${x},${y}`}
          fill="hsl(270, 80%, 60%)"
          stroke="hsl(270, 70%, 45%)"
          strokeWidth={1}
          opacity={0.9}
        />
      );
  }
}

/** Tooltip rendered inside SVG. */
function EventTooltip({ label, x, y, svgWidth }: { label: string; x: number; y: number; svgWidth: number }) {
  const textWidth = label.length * 6.5 + 16;
  const flipped = x + textWidth + 12 > svgWidth;
  const tx = flipped ? x - textWidth - 8 : x + 12;

  return (
    <g>
      <rect
        x={tx}
        y={y - 14}
        width={textWidth}
        height={22}
        rx={4}
        fill="hsl(220, 18%, 14%)"
        stroke="hsl(220, 15%, 22%)"
        strokeWidth={1}
        opacity={0.95}
      />
      <text
        x={tx + 8}
        y={y}
        fontSize={11}
        fill="hsl(40, 30%, 90%)"
        fontFamily="monospace"
      >
        {label}
      </text>
    </g>
  );
}

export default EventOverlay;
