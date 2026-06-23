import { useEffect, useState, type RefObject } from 'react';

/**
 * Observer-pattern detection of the active story stage. Uses IntersectionObserver
 * so it works as the reliable baseline regardless of CSS scroll-driven animation
 * support. The most-visible stage wins; gaps between stages keep the last active
 * index to avoid flicker or backwards jumps.
 */
export function useActiveStoryStage(containerRef: RefObject<HTMLElement | null>, stageCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || stageCount === 0) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const elements = Array.from(container.querySelectorAll<HTMLElement>('[data-story-stage]'));
    if (elements.length === 0) return;

    const ratios = new Map<number, number>();
    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const attr = entry.target.getAttribute('data-story-stage');
          if (attr === null) continue;
          const index = Number(attr);
          if (Number.isNaN(index)) continue;
          ratios.set(index, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          let bestIndex = -1;
          let bestRatio = 0;
          for (const [index, ratio] of ratios) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestIndex = index;
            }
          }
          if (bestIndex >= 0) setActiveIndex(bestIndex);
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-15% 0px -45% 0px' },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [containerRef, stageCount]);

  return { activeIndex, setActiveIndex };
}
