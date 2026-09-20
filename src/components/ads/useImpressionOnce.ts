import { useEffect, useRef, type RefObject } from 'react';

const STORAGE_KEY = 'seen_ads';

function getSeenAds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markAdSeen(id: string) {
  const seen = getSeenAds();
  seen.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
}

/**
 * Fires `onVisible` exactly once per mount when the element is >=50% visible,
 * using an IntersectionObserver — the impression signal for ad slots.
 * Skips if the ad was already seen (localStorage dedup).
 */
export function useImpressionOnce(
  ref: RefObject<HTMLElement | null>,
  adId: string | undefined,
  onVisible: () => void,
) {
  const callbackRef = useRef(onVisible);
  callbackRef.current = onVisible;

  useEffect(() => {
    const element = ref.current;
    if (!element || !adId) return undefined;
    if (getSeenAds().has(adId)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        if (getSeenAds().has(adId)) return;
        markAdSeen(adId);
        callbackRef.current();
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, adId]);
}