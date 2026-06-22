import { useEffect, useState, type RefObject } from 'react';

export function useActiveStoryStage(containerRef: RefObject<HTMLElement | null>, stageCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const elements = Array.from(container.querySelectorAll<HTMLElement>('[data-story-stage]'));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const index = visible?.target.getAttribute('data-story-stage');
      if (index !== null && index !== undefined) setActiveIndex(Number(index));
    }, { threshold: [0.35, 0.6, 0.85], rootMargin: '-20% 0px -35% 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [containerRef, stageCount]);

  return { activeIndex, setActiveIndex };
}
