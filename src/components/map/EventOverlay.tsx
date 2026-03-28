import { useMemo, useState, useCallback, memo } from "react";
import type { GameEvent, Dimensions, GameEventType, MapConfig } from "@/types/map";
import { worldToPixel } from "@/lib/visualization";

interface EventOverlayProps {
  events: GameEvent[];
  dimensions: Dimensions;
  currentTime: number;
  hiddenPlayerIds: Set<string>;
  mapConfig: MapConfig;
}

const EVENT_LABELS: Record<GameEventType, string> = {
  kill: "Kill",
  death: "Death",
  loot: "Loot",
  storm_death: "Storm Death",
};

const EventOverlay = memo(({ events, dimensions, currentTime, hiddenPlayerIds, mapConfig }: EventOverlayProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const visibleEvents = useMemo(
    () => events.filter((e) => e.t <= currentTime && !hiddenPlayerIds.has(e.player_id)),
    [events, currentTime, hiddenPlayerIds]
  );

  const handleMouseEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleMouseLeave = useCallback(() => setHoveredIndex(null), []);

  return (
    <>
      {visibleEvents.map((evt, i) => {
        const pos = worldToPixel(evt.x, evt.z, mapConfig, dimensions);
        const isHovered = hoveredIndex === i;
        return (
          <g
            key={`${evt.player_id}-${evt.type}-${evt.t}-${i}`}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "pointer" }}
          >
            <circle cx={pos.x} cy={pos.y} r={10} fill="transparent" />
            <EventShape type={evt.type} x={pos.x} y={pos.y} hovered={isHovered} />
            {isHovered && (
              <EventTooltip
                label={`${EVENT_LABELS[evt.type]} • t=${evt.t}s`}
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
});

EventOverlay.displayName = "EventOverlay";

function EventShape({ type, x, y, hovered }: { type: GameEventType; x: number; y: number; hovered: boolean }) {
  const size = hovered ? 7 : 5;
  const shadowOpacity = hovered ? 0.4 : 0.25;
  const shadow = <circle cx={x} cy={y + 1} r={size + 1} fill="hsl(0, 0%, 0%)" opacity={shadowOpacity} />;

  switch (type) {
    case "kill":
      return (
        <g>
          {shadow}
          <circle cx={x} cy={y} r={size} fill="hsl(0, 0%, 8%)" stroke="hsl(0, 80%, 58%)" strokeWidth={1.5} opacity={0.95} />
          <line x1={x - size + 2} y1={y} x2={x + size - 2} y2={y} stroke="hsl(0, 80%, 58%)" strokeWidth={1.5} />
          <line x1={x} y1={y - size + 2} x2={x} y2={y + size - 2} stroke="hsl(0, 80%, 58%)" strokeWidth={1.5} />
        </g>
      );
    case "death":
      return (
        <g>
          {shadow}
          <circle cx={x} cy={y} r={size} fill="hsl(0, 0%, 12%)" stroke="hsl(0, 65%, 48%)" strokeWidth={1.5} opacity={0.95} />
          <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y + 3} stroke="hsl(0, 65%, 48%)" strokeWidth={1.5} />
          <line x1={x + 3} y1={y - 3} x2={x - 3} y2={y + 3} stroke="hsl(0, 65%, 48%)" strokeWidth={1.5} />
        </g>
      );
    case "loot":
      return (
        <g>
          {shadow}
          <polygon
            points={`${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`}
            fill="hsl(50, 90%, 52%)"
            stroke="hsl(42, 80%, 38%)"
            strokeWidth={1}
            opacity={0.92}
          />
        </g>
      );
    case "storm_death":
      return (
        <g>
          {shadow}
          <polygon
            points={`${x - 2},${y - size} ${x + 3},${y - 1} ${x},${y} ${x + 2},${y + size} ${x - 3},${y + 1} ${x},${y}`}
            fill="hsl(268, 75%, 58%)"
            stroke="hsl(268, 60%, 40%)"
            strokeWidth={1}
            opacity={0.92}
          />
        </g>
      );
  }
}

function EventTooltip({ label, x, y, svgWidth }: { label: string; x: number; y: number; svgWidth: number }) {
  const textWidth = label.length * 6.2 + 20;
  const flipped = x + textWidth + 14 > svgWidth;
  const tx = flipped ? x - textWidth - 10 : x + 14;
  const ty = y - 16;

  return (
    <g>
      <rect x={tx + 1} y={ty + 1} width={textWidth} height={24} rx={5} fill="hsl(0, 0%, 0%)" opacity={0.35} />
      <rect
        x={tx}
        y={ty}
        width={textWidth}
        height={24}
        rx={5}
        fill="hsl(220, 20%, 12%)"
        stroke="hsl(220, 15%, 28%)"
        strokeWidth={0.75}
      />
      <text
        x={tx + 10}
        y={ty + 16}
        fontSize={10.5}
        fill="hsl(40, 30%, 92%)"
        fontFamily="ui-monospace, monospace"
        fontWeight={500}
      >
        {label}
      </text>
    </g>
  );
}

export default EventOverlay;
