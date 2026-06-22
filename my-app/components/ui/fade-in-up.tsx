"use client";

import { useInView } from "@/hooks/use-in-view";
import "./fade-in-up.css";

interface FadeInUpProps {
  children: React.ReactNode;
  /** Extra Tailwind classes forwarded to the wrapper div. */
  className?: string;
  /**
   * Delay before the animation starts (ms).
   * Useful for staggering sibling elements.
   */
  delay?: number;
  /** Animation duration in ms. Defaults to 700. */
  duration?: number;
  /**
   * Fraction of the element that must be visible to trigger (0–1).
   * Lower values fire earlier. Defaults to 0.
   */
  threshold?: number;
}

/**
 * Wraps any content in a div that fades in and slides up from the bottom
 * the first time it enters the viewport.
 */
export function FadeInUp({
  children,
  className = "",
  delay = 0,
  duration = 700,
  threshold = 0,
}: FadeInUpProps) {
  const { ref, inView } = useInView({ threshold });

  return (
    <div
      ref={ref}
      className={`fade-in-up${inView ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{
        animationDuration: `${duration}ms`,
        ...(delay > 0 && { animationDelay: `${delay}ms` }),
      }}
    >
      {children}
    </div>
  );
}
