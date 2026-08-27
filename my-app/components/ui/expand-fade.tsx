"use client";

import { useEffect, useRef, useState } from "react";
import "./expand-fade.css";

interface ExpandFadeProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

const DURATION_MS = 580;

/** Height-measured expand/collapse with fade + slide for reliable smooth motion. */
export function ExpandFade({ open, children, className = "" }: ExpandFadeProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Both the starting and the target height are set inside animation frames.
    // Setting the start height synchronously here would be a setState in the
    // effect body, and the browser would coalesce it with the target anyway —
    // the transition needs the two values in separate frames to run at all.
    let second = 0;
    const first = requestAnimationFrame(() => {
      setHeight(open ? 0 : el.scrollHeight);
      second = requestAnimationFrame(() => setHeight(open ? el.scrollHeight : 0));
    });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [open]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || !open) return;

    const syncHeight = () => setHeight(el.scrollHeight);
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, children]);

  return (
    <div
      className={`expand-fade-smooth${open ? " is-open" : ""}${className ? ` ${className}` : ""}`}
      style={
        {
          height,
          "--expand-duration": `${DURATION_MS}ms`,
        } as React.CSSProperties
      }
      aria-hidden={!open && height === 0}
    >
      <div ref={contentRef} className={`expand-fade-smooth-body${open ? " is-open" : ""}`}>
        {children}
      </div>
    </div>
  );
}
