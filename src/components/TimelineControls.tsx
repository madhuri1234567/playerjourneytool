import { Play, Pause, SkipBack } from "lucide-react";
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
    <div className="flex items-center gap-3 px-5 py-3 bg-card/95 backdrop-blur-sm border-t border-border shrink-0">
      {/* Reset */}
      <button
        onClick={() => onSeek(minTime)}
        className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
        aria-label="Reset to start"
      >
        <SkipBack className="w-3.5 h-3.5" />
      </button>

      {/* Play / Pause */}
      <button
        onClick={onTogglePlay}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Speed toggle */}
      <button
        onClick={onCycleSpeed}
        className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors min-w-[38px] tracking-tight"
      >
        {speed}×
      </button>

      {/* Slider track */}
      <div className="flex-1 relative h-9 flex items-center group">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/80"
            style={{ width: `${progress}%` }}
          />
        </div>
        <input
          type="range"
          min={minTime}
          max={maxTime}
          step={(maxTime - minTime) / 300 || 0.01}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="absolute inset-x-0 w-full h-6 appearance-none bg-transparent cursor-pointer z-10
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent"
        />
      </div>

      {/* Time label */}
      <span className="text-[11px] font-mono text-muted-foreground min-w-[52px] text-right tabular-nums select-none">
        t={currentTime.toFixed(1)}
      </span>
    </div>
  );
};

export default TimelineControls;
