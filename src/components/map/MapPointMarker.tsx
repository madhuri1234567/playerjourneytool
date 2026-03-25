import type { PixelCoord, Dimensions } from "@/types/map";

const MAX_LABEL_CHARS = 18;
const CHAR_WIDTH = 7.5;
const TOOLTIP_PADDING_X = 12;
const TOOLTIP_HEIGHT = 24;
const TOOLTIP_GAP = 14;
const TEXT_OFFSET = 6;

function truncateLabel(label: string): string {
  if (label.length <= MAX_LABEL_CHARS) return label;
  return label.slice(0, MAX_LABEL_CHARS - 1).trimEnd() + "…";
}

interface MapPointMarkerProps {
  pos: PixelCoord;
  order?: number;
  label?: string;
  isActive: boolean;
  svgDimensions: Dimensions;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/** Single interactive point rendered on the SVG overlay. */
const MapPointMarker = ({
  pos,
  order,
  label,
  isActive,
  svgDimensions,
  onMouseEnter,
  onMouseLeave,
}: MapPointMarkerProps) => {
  const displayLabel = label ? truncateLabel(label) : undefined;
  const tooltipWidth = displayLabel
    ? displayLabel.length * CHAR_WIDTH + TOOLTIP_PADDING_X
    : 0;

  // Flip tooltip to the left if it would overflow the right edge
  const overflowsRight = pos.x + TOOLTIP_GAP + tooltipWidth > svgDimensions.width;
  const tooltipX = overflowsRight
    ? pos.x - TOOLTIP_GAP - tooltipWidth
    : pos.x + TOOLTIP_GAP;
  const textX = tooltipX + TEXT_OFFSET;

  return (
    <g
      className="pointer-events-auto cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Glow ring */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={isActive ? 16 : 10}
        fill="hsl(var(--point-glow) / 0.25)"
        className="transition-all duration-200"
      />
      {/* Solid dot */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={isActive ? 7 : 5}
        fill="hsl(var(--point-default))"
        stroke="hsl(var(--background))"
        strokeWidth={2}
        className="transition-all duration-200"
      />
      {/* Order label */}
      {order != null && (
        <text
          x={pos.x}
          y={pos.y + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fill="hsl(var(--primary-foreground))"
          fontSize={isActive ? 9 : 7}
          fontWeight="bold"
          className="select-none transition-all duration-200"
        >
          {order}
        </text>
      )}
      {/* Tooltip */}
      {isActive && displayLabel && (
        <g>
          <rect
            x={tooltipX}
            y={pos.y - 12}
            width={tooltipWidth}
            height={TOOLTIP_HEIGHT}
            rx={4}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
          <text
            x={textX}
            y={pos.y + 1}
            fill="hsl(var(--foreground))"
            fontSize={12}
            fontWeight={500}
          >
            {displayLabel}
          </text>
        </g>
      )}
    </g>
  );
};

export default MapPointMarker;
