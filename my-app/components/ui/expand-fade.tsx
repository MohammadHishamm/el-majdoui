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

    if (open) {
      const target = el.scrollHeight;
      setHeight(0);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(target));
      });
      return () => cancelAnimationFrame(frame);
    }

    const current = el.scrollHeight;
    setHeight(current);
    const frame = requestAnimationFrame(() => setHeight(0));
    return () => cancelAnimationFrame(frame);
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
