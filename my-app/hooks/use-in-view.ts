import { useCallback, useEffect, useState } from "react";

interface UseInViewOptions {
  /** Fraction of the element that must be visible before triggering (0–1). */
  threshold?: number;
  /**
   * Shrinks the effective viewport bottom so the animation triggers
   * slightly before the element fully enters the screen.
   */
  rootMargin?: string;
}

interface UseInViewReturn {
  ref: (node: HTMLDivElement | null) => void;
  inView: boolean;
}

/**
 * Fires once when the observed element crosses the viewport threshold,
 * then disconnects the observer to avoid further work.
 */
export function useInView({
  threshold = 0,
  rootMargin = "0px 0px -8% 0px",
}: UseInViewOptions = {}): UseInViewReturn {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  const ref = useCallback((element: HTMLDivElement | null) => {
    setNode(element);
  }, []);

  useEffect(() => {
    if (!node || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold, rootMargin, inView]);

  return { ref, inView };
}
