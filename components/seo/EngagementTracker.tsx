'use client';

import { useEffect, useRef, useCallback } from 'react';

type ScrollDepth = 25 | 50 | 75 | 100;
type TimeMarker = 15 | 30 | 60 | 120;

const SCROLL_DEPTHS: ScrollDepth[] = [25, 50, 75, 100];
const TIME_MARKERS: TimeMarker[] = [15, 30, 60, 120];

function trackGoal(goal: string, params?: Record<string, unknown>) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ym = (window as any).ym;
    if (typeof ym === 'function') {
      ym(109105382, 'reachGoal', goal);
      if (params) {
        ym(109105382, 'params', params);
      }
    }
  } catch {
    // Metrika not available
  }
}

export default function EngagementTracker() {
  const trackedScroll = useRef<Set<ScrollDepth>>(new Set());
  const trackedTime = useRef<Set<TimeMarker>>(new Set());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const markerRefs = useRef<Map<ScrollDepth, HTMLDivElement | null>>(new Map());

  const handleScrollDepth = useCallback((depth: ScrollDepth) => {
    if (trackedScroll.current.has(depth)) return;
    trackedScroll.current.add(depth);
    const eventName = `scroll_${depth}` as const;
    trackGoal(eventName, { scroll_depth: depth, page: window.location.pathname });
  }, []);

  const handleTimeMarker = useCallback((seconds: TimeMarker) => {
    if (trackedTime.current.has(seconds)) return;
    trackedTime.current.add(seconds);
    const eventName = `time_${seconds}s` as const;
    trackGoal(eventName, { time_on_page: seconds, page: window.location.pathname });
  }, []);

  useEffect(() => {
    // Time tracking
    TIME_MARKERS.forEach((seconds) => {
      const timer = setTimeout(() => {
        handleTimeMarker(seconds);
      }, seconds * 1000);
      timers.current.push(timer);
    });

    // Scroll depth tracking with IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const depth = Number(entry.target.getAttribute('data-depth')) as ScrollDepth;
            if (depth) {
              handleScrollDepth(depth);
            }
          }
        });
      },
      { rootMargin: '0px', threshold: 0 }
    );

    // Observe all scroll depth markers
    markerRefs.current.forEach((el) => {
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    // RFQ button click tracking
    const handleRfqClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href*="#bom"], a[href*="/rfq"]');
      if (anchor) {
        trackGoal('rfq_click', { page: window.location.pathname });
      }
    };
    document.addEventListener('click', handleRfqClick, { passive: true });

    // Component exploration tracking
    const handleComponentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="/component/"]');
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        trackGoal('component_explore', { page: window.location.pathname, component: href });
      }
    };
    document.addEventListener('click', handleComponentClick, { passive: true });

    return () => {
      // Cleanup timers
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current = [];

      // Cleanup observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Cleanup event listeners
      document.removeEventListener('click', handleRfqClick);
      document.removeEventListener('click', handleComponentClick);
    };
  }, [handleScrollDepth, handleTimeMarker]);

  // Set ref callback for each scroll depth marker
  const setMarkerRef = useCallback((depth: ScrollDepth) => (el: HTMLDivElement | null) => {
    markerRefs.current.set(depth, el);
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  return (
    <>
      {/* Invisible scroll depth markers */}
      {SCROLL_DEPTHS.map((depth) => (
        <div
          key={depth}
          ref={setMarkerRef(depth)}
          data-depth={depth}
          className="pointer-events-none absolute w-0 h-0"
          style={{
            top: `${depth}%`,
            left: 0,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
