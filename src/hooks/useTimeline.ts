import { useState, useCallback, useRef, useEffect } from "react";

export type PlaybackSpeed = 1 | 2 | 4;

interface UseTimelineOptions {
  minTime: number;
  maxTime: number;
}

export function useTimeline({ minTime, maxTime }: UseTimelineOptions) {
  const [currentTime, setCurrentTime] = useState(minTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  const duration = maxTime - minTime || 1;

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const cycleSpeed = useCallback(() => {
    setSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1));
  }, []);

  const seek = useCallback(
    (time: number) => {
      setCurrentTime(Math.max(minTime, Math.min(maxTime, time)));
    },
    [minTime, maxTime]
  );

  // Reset to start when data range changes
  useEffect(() => {
    setCurrentTime(minTime);
    setIsPlaying(false);
  }, [minTime, maxTime]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    lastFrameRef.current = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastFrameRef.current) / 1000; // seconds
      lastFrameRef.current = now;

      setCurrentTime((prev) => {
        // Each "unit" of game time takes ~(duration / 10) seconds at 1x
        const step = (duration / 10) * speed * delta;
        const next = prev + step;
        if (next >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, speed, duration, maxTime]);

  return {
    currentTime,
    isPlaying,
    speed,
    minTime,
    maxTime,
    play,
    pause,
    togglePlay,
    cycleSpeed,
    seek,
  };
}
