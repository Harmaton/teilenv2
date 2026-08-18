'use client'
import { useEffect, useRef, useState } from "react";

/**
 * Returns the current breakpoint state based on window width.
 * mobile: <= 600px, tablet: <= 900px
 */
export function useBreakpoint() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width,
    isTablet: width <= 900,
    isMobile: width <= 600,
  };
}

/**
 * Attaches an IntersectionObserver to fade+rise an element into view,
 * replicating the `.fi` / `.fi.vis` behavior from the original page.
 */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.07 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: "opacity .65s ease, transform .65s ease",
  };

  return { ref, style };
}