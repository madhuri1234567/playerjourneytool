import type { PixelCoord } from "@/types/map";

interface JourneyPathProps {
  coords: PixelCoord[];
  pathD: string;
}

/** Dashed SVG path connecting journey points in order. */
const JourneyPath = ({ pathD }: JourneyPathProps) => (
  <path
    d={pathD}
    fill="none"
    stroke="hsl(var(--journey-line))"
    strokeWidth={2.5}
    strokeDasharray="8 4"
    strokeLinecap="round"
    opacity={0.7}
  />
);

export default JourneyPath;
