// Central place to read env-configurable UI values

export const APP_NAME =
  process.env.REACT_APP_APP_NAME?.trim() || "AspectReact Store";

export const DEFAULT_LOCALE =
  process.env.REACT_APP_DEFAULT_LOCALE?.trim() || "en-US";

export const CURRENCY =
  process.env.REACT_APP_CURRENCY?.trim() || "USD";

export const ENABLE_AUTH =
  String(process.env.REACT_APP_ENABLE_AUTH || "true").toLowerCase() === "true";

export const ENABLE_TOASTS =
  String(process.env.REACT_APP_ENABLE_TOASTS || "true").toLowerCase() === "true";
