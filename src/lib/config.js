/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
// ────────────────────────────────────────────
// Small helpers
// ────────────────────────────────────────────
const toBool = (val, fallback = false) => {
  if (val === undefined || val === null) return fallback;
  return ["1", "true", "yes", "on"].includes(String(val).toLowerCase());
};
const toStr = (val, fallback = "") => (val == null ? fallback : String(val).trim());

// ────────────────────────────────────────────
// Environment
// (CRA injects NODE_ENV; default guarded for safety)
// ────────────────────────────────────────────
export const NODE_ENV =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV) ||
  "production";
export const IS_DEV = NODE_ENV === "development";

// ────────────────────────────────────────────
// Brand / UI
// ────────────────────────────────────────────
export const APP_NAME = toStr(process.env.REACT_APP_APP_NAME, "AspectReact Store");
export const APP_COPYRIGHT_HOLDER = toStr(process.env.REACT_APP_COPYRIGHT_HOLDER, "AspectReact Store");
export const DEFAULT_LOCALE = toStr(process.env.REACT_APP_DEFAULT_LOCALE, "en-US");
export const CURRENCY = toStr(process.env.REACT_APP_CURRENCY, "USD").toUpperCase();

// Brand signals (soft attribution + generator meta)
// Toggle in .env via REACT_APP_SHOW_POWERED_BY / REACT_APP_META_GENERATOR
export const SHOW_POWERED_BY = toBool(process.env.REACT_APP_SHOW_POWERED_BY, true);
export const META_GENERATOR = toBool(process.env.REACT_APP_META_GENERATOR, true);

// Centralized labels so UI uses consistent wording
export const POWERED_BY_TEXT = "Built with AspectReact"; // footer/credits label
export const GENERATOR_NAME = "AspectReact";             // <meta name="generator" content=...>

// ────────────────────────────────────────────
// Auth mode
// Options:  "local" | "api" | "auth0"
// (Default aligned with .env.example -> "local")
// ────────────────────────────────────────────
const RAW_MODE = toStr(process.env.REACT_APP_AUTH_MODE, "local").toLowerCase();
const ALLOWED_MODES = new Set(["local", "api", "auth0"]);
const SAFE_MODE = ALLOWED_MODES.has(RAW_MODE) ? RAW_MODE : "local";

if (IS_DEV && RAW_MODE && RAW_MODE !== SAFE_MODE) {
  // eslint-disable-next-line no-console
  console.warn(
    `[config] Invalid REACT_APP_AUTH_MODE="${RAW_MODE}" — falling back to "local". Allowed: local | api | auth0.`
  );
}

export const AUTH_MODE = SAFE_MODE;
export const IS_LOCAL = AUTH_MODE === "local";
export const IS_API = AUTH_MODE === "api";
export const IS_AUTH0 = AUTH_MODE === "auth0";

// ────────────────────────────────────────────
// Feature flags
// ────────────────────────────────────────────
export const ENABLE_TOASTS = toBool(process.env.REACT_APP_ENABLE_TOASTS, true);

// ────────────────────────────────────────────
// API (used in "api" auth mode and future data calls)
// ────────────────────────────────────────────
export const API_BASE_URL = toStr(process.env.REACT_APP_API_BASE_URL, "");

// ────────────────────────────────────────────
// Auth0 (used only when AUTH_MODE === "auth0")
// ────────────────────────────────────────────
export const AUTH0_DOMAIN = toStr(process.env.REACT_APP_AUTH0_DOMAIN, "");
export const AUTH0_CLIENT_ID = toStr(process.env.REACT_APP_AUTH0_CLIENT_ID, "");

// ────────────────────────────────────────────
// Support / Contact (used e.g. on NotFound page)
// ────────────────────────────────────────────
export const SUPPORT_EMAIL = toStr(
  process.env.REACT_APP_SUPPORT_EMAIL,
  "support@yourdomain.com"
).toLowerCase();

// ────────────────────────────────────────────
// Optional integrations (kept here for future use)
// ────────────────────────────────────────────
// export const STRIPE_PUBLISHABLE_KEY = toStr(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY, "");
// export const ANALYTICS_WRITE_KEY = toStr(process.env.REACT_APP_ANALYTICS_WRITE_KEY, "");
