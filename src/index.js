// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./index.css";
import {
  APP_NAME,
  IS_AUTH0,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID
} from "./lib/config";

// ──────────────────────────────────────────────
// Set page title
// ──────────────────────────────────────────────
if (typeof document !== "undefined") {
  document.title = APP_NAME;
}

// ──────────────────────────────────────────────
// Auth0 redirect handler
// ──────────────────────────────────────────────
const onRedirectCallback = (appState) => {
  const target =
    (appState && appState.returnTo) || window.location.pathname || "/";
  window.history.replaceState({}, document.title, target);
};

// ──────────────────────────────────────────────
 // Wrap app in Auth0Provider only when AUTH_MODE=auth0
// ──────────────────────────────────────────────
function withAuthProvider(children) {
  if (!IS_AUTH0) return children;

  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
    if (process.env.NODE_ENV === "development") {
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
        redirect_uri: window.location.origin
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
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>{withAuthProvider(<App />)}</React.StrictMode>
);
