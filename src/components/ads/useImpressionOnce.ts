import { useEffect, useRef, type RefObject } from 'react';

/**
 * Fires `onVisible` exactly once per mount when the element is >=50% visible,
 * using an IntersectionObserver — the impression signal for ad slots.
 */
export function useImpressionOnce(
  ref: RefObject<HTMLElement | null>,
  onVisible: () => void,
) {
  const callbackRef = useRef(onVisible);
  callbackRef.current = onVisible;

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        callbackRef.current();
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}