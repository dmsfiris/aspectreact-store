/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
// Small helper to coerce env strings to boolean
const toBool = (val, fallback = false) => {
  if (val === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(String(val).toLowerCase());
};

// ────────────────────────────────────────────
// Brand / UI
// ────────────────────────────────────────────
export const APP_NAME = process.env.REACT_APP_APP_NAME || "AspectReact Store";
export const DEFAULT_LOCALE = process.env.REACT_APP_DEFAULT_LOCALE || "en-US";
export const CURRENCY = process.env.REACT_APP_CURRENCY || "USD";

// ────────────────────────────────────────────
// Auth mode
// Options: "auth0" | "local" | "api"
// ────────────────────────────────────────────
export const AUTH_MODE = (process.env.REACT_APP_AUTH_MODE || "auth0").toLowerCase();
export const IS_AUTH0 = AUTH_MODE === "auth0";
export const IS_LOCAL = AUTH_MODE === "local";
export const IS_API = AUTH_MODE === "api";

// ────────────────────────────────────────────
// Feature flags
// ────────────────────────────────────────────
export const ENABLE_TOASTS = toBool(process.env.REACT_APP_ENABLE_TOASTS, true);

// ────────────────────────────────────────────
// API (used in "api" auth mode and future data calls)
// ────────────────────────────────────────────
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// ────────────────────────────────────────────
// Auth0 (used only when AUTH_MODE === "auth0")
// ────────────────────────────────────────────
export const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN || "";
export const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID || "";

// ────────────────────────────────────────────
// Optional integrations (kept here for future use)
// ────────────────────────────────────────────
// export const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "";
// export const ANALYTICS_WRITE_KEY = process.env.REACT_APP_ANALYTICS_WRITE_KEY || "";
