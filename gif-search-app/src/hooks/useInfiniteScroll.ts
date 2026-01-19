import { useEffect, useRef } from "react";

export function useInfiniteScroll(onReachEnd: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onReachEnd();
      },
      { rootMargin: "600px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [onReachEnd, enabled]);

  return ref;
}
