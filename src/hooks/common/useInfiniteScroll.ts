import { useRef, useEffect, useCallback } from 'react';

/** Returns a ref to attach to a sentinel <div>; fires onLoadMore when the sentinel becomes visible. */
export function useInfiniteScroll(onLoadMore: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.isIntersecting) onLoadMoreRef.current();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(callback, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [callback, enabled]);

  return sentinelRef;
}
