/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./index.css";
import {
  APP_NAME,
  IS_AUTH0,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  DEFAULT_LOCALE,
} from "./lib/config";

// Determine dev mode safely (works in CRA and outside)
const isDev =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "development";

// ──────────────────────────────────────────────
// Document metadata
// ──────────────────────────────────────────────
if (typeof document !== "undefined") {
  // Title
  document.title = APP_NAME;

  // Set <html lang="..."> for a11y/SEO (e.g., "en-US" → "en")
  const html = document.documentElement;
  const lang = (DEFAULT_LOCALE || "en").split(/[-_]/)[0] || "en";
  if (html) html.setAttribute("lang", lang);
}

// ──────────────────────────────────────────────
/** Auth0 redirect handler preserves intended route */
// ──────────────────────────────────────────────
const onRedirectCallback = (appState) => {
  const target =
    (appState && appState.returnTo) || window.location.pathname || "/";
  window.history.replaceState({}, document.title, target);
};

// ──────────────────────────────────────────────
/** Wrap app with Auth0Provider only when AUTH_MODE=auth0 */
// ──────────────────────────────────────────────
function withAuthProvider(children) {
  if (!IS_AUTH0) return children;

  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(
        `[AspectReact Store] AUTH_MODE is "auth0" but domain/clientId are missing.
         Set REACT_APP_AUTH0_DOMAIN and REACT_APP_AUTH0_CLIENT_ID in your .env.local.`
      );
    }
    return children;
  }

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      onRedirectCallback={onRedirectCallback}
      // Enable longer sessions across reloads
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  );
}

// ──────────────────────────────────────────────
// Render app
// ──────────────────────────────────────────────
const container =
  typeof document !== "undefined" ? document.getElementById("root") : null;

if (!container) {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.error(
      '[AspectReact Store] No element with id="root" found in public/index.html.'
    );
  }
} else {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>{withAuthProvider(<App />)}</React.StrictMode>
  );
}
