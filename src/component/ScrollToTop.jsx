/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ behavior = "smooth", top = 0 }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If there’s a hash (e.g., /about#team), try to scroll to that element first
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior });
        return;
      }
    }
    // Otherwise go to the top
    window.scrollTo({ top, behavior });
  }, [pathname, search, hash, behavior, top]);

  return null; // No HTML to render — it only performs a side effect
}
