import { useState, useCallback, useRef, type WheelEvent, type MouseEvent } from "react";

interface ZoomPanState {
  scale: number;
  translateX: number;
  translateY: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const ZOOM_STEP = 0.15;

export function useZoomPan() {
  const [state, setState] = useState<ZoomPanState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    // Mouse position relative to container
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setState((prev) => {
      const direction = e.deltaY < 0 ? 1 : -1;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * (1 + direction * ZOOM_STEP)));

      if (newScale === prev.scale) return prev;

      // Zoom toward mouse position
      const scaleRatio = newScale / prev.scale;
      const newTx = mx - (mx - prev.translateX) * scaleRatio;
      const newTy = my - (my - prev.translateY) * scaleRatio;

      return { scale: newScale, translateX: newTx, translateY: newTy };
    });
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // left click only
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    setState((prev) => ({
      ...prev,
      translateX: prev.translateX + dx,
      translateY: prev.translateY + dy,
    }));
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent<HTMLDivElement>) => {
    isPanning.current = false;
    e.currentTarget.style.cursor = "grab";
  }, []);

  const handleMouseLeave = useCallback((e: MouseEvent<HTMLDivElement>) => {
    isPanning.current = false;
    e.currentTarget.style.cursor = "grab";
  }, []);

  const reset = useCallback(() => {
    setState({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  const transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;

  return {
    scale: state.scale,
    transform,
    handlers: {
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
    reset,
  };
}
