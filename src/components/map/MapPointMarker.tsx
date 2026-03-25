import type { PixelCoord } from "@/types/map";

interface MapPointMarkerProps {
  pos: PixelCoord;
  order?: number;
  label?: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/** Single interactive point rendered on the SVG overlay. */
const MapPointMarker = ({
  pos,
  order,
  label,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: MapPointMarkerProps) => (
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
    {isActive && label && (
      <g>
        <rect
          x={pos.x + 14}
          y={pos.y - 12}
          width={label.length * 7.5 + 12}
          height={24}
          rx={4}
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth={1}
        />
        <text
          x={pos.x + 20}
          y={pos.y + 1}
          fill="hsl(var(--foreground))"
          fontSize={12}
          fontWeight={500}
        >
          {label}
        </text>
      </g>
    )}
  </g>
);

export default MapPointMarker;
