import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./index.css";
import { APP_NAME, ENABLE_AUTH } from "./lib/config";

const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN || "";
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID || "";

// Set page title from env-configurable name
if (typeof document !== "undefined") {
  document.title = APP_NAME;
}

function withAuthProvider(children) {
  if (!ENABLE_AUTH) return children;

  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn(
        "[AspectReact Store] Auth is enabled but Auth0 env vars are missing. " +
          "Set REACT_APP_AUTH0_DOMAIN and REACT_APP_AUTH0_CLIENT_ID in your .env."
      );
    }
    return children;
  }

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      {children}
    </Auth0Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>{withAuthProvider(<App />)}</React.StrictMode>
);
