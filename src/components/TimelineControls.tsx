import { Play, Pause } from "lucide-react";
import type { PlaybackSpeed } from "@/hooks/useTimeline";

interface TimelineControlsProps {
  currentTime: number;
  minTime: number;
  maxTime: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  onTogglePlay: () => void;
  onCycleSpeed: () => void;
  onSeek: (time: number) => void;
}

const TimelineControls = ({
  currentTime,
  minTime,
  maxTime,
  isPlaying,
  speed,
  onTogglePlay,
  onCycleSpeed,
  onSeek,
}: TimelineControlsProps) => {
  const progress = maxTime > minTime
    ? ((currentTime - minTime) / (maxTime - minTime)) * 100
    : 100;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-card border-t border-border shrink-0">
      {/* Play / Pause */}
      <button
        onClick={onTogglePlay}
        className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      {/* Speed toggle */}
      <button
        onClick={onCycleSpeed}
        className="px-2 py-1 text-xs font-mono font-semibold rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors min-w-[36px]"
      >
        {speed}x
      </button>

      {/* Slider */}
      <div className="flex-1 relative h-8 flex items-center">
        <input
          type="range"
          min={minTime}
          max={maxTime}
          step={(maxTime - minTime) / 200 || 0.01}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-1.5 appearance-none bg-secondary rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background
            [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-background"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--secondary)) ${progress}%)`,
          }}
        />
      </div>

      {/* Time label */}
      <span className="text-xs font-mono text-muted-foreground min-w-[48px] text-right tabular-nums">
        t={currentTime.toFixed(1)}
      </span>
    </div>
  );
};

export default TimelineControls;
