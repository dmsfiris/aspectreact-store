/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React, { useEffect, useMemo, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

export default function BackToTop({ threshold = 400 }) {
  const [visible, setVisible] = useState(false);

  // Respect reduced-motion preferences
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    const onScroll = () => {
      const y =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(y > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialize on mount

    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const handleClick = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={handleClick}
      className={[
        // position
        "fixed bottom-6 right-6 z-50",
        // shape & colors
        "rounded-full bg-ink text-white shadow-lg",
        "hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        // spacing
        "p-3",
        // show/hide transitions
        "transform transition ease-out duration-200",
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
      ].join(" ")}
    >
      <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
      <span className="sr-only">Back to top</span>
    </button>
  );
}
