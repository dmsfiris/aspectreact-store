// src/lib/auth.js
import { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useLocation } from "react-router-dom";
import {
  AUTH_MODE,
  API_BASE_URL,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID
} from "./config";

/* ------------------------------------ *
 * Local persistence (local + api modes)
 * ------------------------------------ */
const LOCAL_USER_KEY = "auth_user";
const API_TOKEN_KEY = "auth_token";

// OPTIONAL CSRF token storage (your backend should issue one)
const CSRF_STORAGE_KEY = "csrf_token"; // e.g., set this from app bootstrap after reading a meta tag
const CSRF_HEADER = "X-CSRF-Token";

function getLocalUser() {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function setLocalUser(user) {
  try {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } catch {}
}
function clearLocalUser() {
  try {
    localStorage.removeItem(LOCAL_USER_KEY);
  } catch {}
}

function getApiToken() {
  try {
    return localStorage.getItem(API_TOKEN_KEY);
  } catch {
    return null;
  }
}
function setApiToken(token) {
  try {
    if (token) localStorage.setItem(API_TOKEN_KEY, token);
  } catch {}
}
function clearApiToken() {
  try {
    localStorage.removeItem(API_TOKEN_KEY);
  } catch {}
}

function getCsrfToken() {
  try {
    return localStorage.getItem(CSRF_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

/* ---------------------- *
 * User utilities
 * ---------------------- */
export function getUserId(user) {
  if (!user) return null;
  if (user.sub) return user.sub; // Auth0
  if (user.id) return String(user.id); // API/local
  if (user.email) return user.email.toLowerCase();
  return null;
}

/* ---------------------- *
 * Mode helpers
 * ---------------------- */
const MODE = (AUTH_MODE || "none").toLowerCase();
const IS_LOCAL = MODE === "local";
const IS_API = MODE === "api";
const IS_AUTH0 = MODE === "auth0";

/* ------------------------------------ *
 * LOCAL MODE IMPLEMENTATION
 * ------------------------------------ */
function useAuthLocal() {
  const localUser = getLocalUser();

  const localLogin = async ({ email, password }) => {
    const trimmedEmail = (email || "").trim();
    const existing = getLocalUser();
    if (!existing || existing.email !== trimmedEmail || existing.password !== password) {
      throw new Error("Invalid email or password");
    }
    return existing; // UI decides navigation
  };

  const localSignup = async ({ email, password, name }) => {
    const trimmedEmail = (email || "").trim();
    if (!trimmedEmail || !password) {
      throw new Error("Please provide email and password");
    }
    const newUser = {
      id: trimmedEmail, // stable per-user key
      name: name || trimmedEmail.split("@")[0] || "Local User",
      email: trimmedEmail,
      password, // DEMO ONLY — never store plain passwords client-side in real apps
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || trimmedEmail)}`
    };
    setLocalUser(newUser);
    return newUser;
  };

  return {
    isAuthenticated: !!localUser,
    isLoading: false,
    user: localUser,
    login: localLogin,
    signup: localSignup,
    logout: async () => clearLocalUser(),
    resetPassword: async (email) => {
      const trimmedEmail = (email || "").trim();
      const existing = getLocalUser();
      if (!existing || existing.email !== trimmedEmail) {
        throw new Error("No user found with that email");
      }
      await new Promise((r) => setTimeout(r, 400)); // simulate async
    }
  };
}

/* ------------------------------------ *
 * API MODE IMPLEMENTATION (refresh/CSRF scaffold)
 * ------------------------------------ */
function useAuthApi() {
  const user = getLocalUser();
  const token = getApiToken();
  const authed = !!token && !!user;

  // Keep a single in-flight refresh promise so concurrent 401s don't stampede.
  let refreshingPromise = null;
  let refreshTimerId = null;

  const clearRefreshTimer = () => {
    if (refreshTimerId) clearTimeout(refreshTimerId);
    refreshTimerId = null;
  };

  const scheduleRefresh = (expiresInSec) => {
    clearRefreshTimer();
    const lead = Math.min(60, Math.max(10, Math.floor(expiresInSec * 0.15))); // 15% of window, 10..60s
    const delayMs = Math.max(0, (expiresInSec - lead) * 1000);
    if (Number.isFinite(delayMs) && delayMs > 0) {
      refreshTimerId = setTimeout(() => {
        // Fire and forget; errors handled on next API call
        void refreshAccessToken().catch(() => {});
      }, delayMs);
    }
  };

  const refreshAccessToken = async () => {
    if (refreshingPromise) return refreshingPromise;
    if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");

    refreshingPromise = (async () => {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // refresh cookie
        headers: {
          "Content-Type": "application/json",
          [CSRF_HEADER]: getCsrfToken()
        }
      });

      if (!res.ok) {
        clearApiToken();
        clearLocalUser();
        clearRefreshTimer();
        throw new Error(`Refresh failed (${res.status})`);
      }

      const data = await res.json(); // expected: { token, user?, expiresIn? }
      if (data.token) setApiToken(data.token);
      if (data.user) setLocalUser(data.user);
      if (data.expiresIn) scheduleRefresh(Number(data.expiresIn));
      return data;
    })();

    try {
      return await refreshingPromise;
    } finally {
      refreshingPromise = null;
    }
  };

  const apiFetchRaw = async (
    path,
    { method = "POST", body, headers = {}, auth = true, credentials, signal } = {}
  ) => {
    if (!API_BASE_URL) throw new Error("API_BASE_URL is not set");

    const finalHeaders = { "Content-Type": "application/json", ...headers };
    const currentToken = getApiToken();
    if (auth && currentToken) {
      finalHeaders.Authorization = `Bearer ${currentToken}`;
    }
    // If your backend requires CSRF on state-changing requests, uncomment:
    // finalHeaders[CSRF_HEADER] = getCsrfToken();

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body,
      credentials, // for endpoints that need cookie (e.g., refresh/logout)
      signal
    });
    return res;
  };

  // Wrapper: on 401, attempt refresh once, then retry the original request
  const apiFetch = async (path, opts = {}) => {
    const res = await apiFetchRaw(path, opts);
    if (res.ok) return res.json();

    if (res.status === 401 && opts.auth !== false) {
      try {
        await refreshAccessToken();
      } catch {
        let msg = "Unauthorized";
        try {
          msg = (await res.json())?.message || msg;
        } catch {}
        throw new Error(msg);
      }
      const retry = await apiFetchRaw(path, opts);
      if (!retry.ok) {
        let msg = `Request failed (${retry.status})`;
        try {
          msg = (await retry.json())?.message || msg;
        } catch {}
        throw new Error(msg);
      }
      return retry.json();
    }

    let msg = `Request failed (${res.status})`;
    try {
      msg = (await res.json())?.message || msg;
    } catch {}
    throw new Error(msg);
  };

  return {
    isAuthenticated: authed,
    isLoading: false,
    user,

    // Expect your backend to return: { token, user, expiresIn? }
    login: async ({ email, password }) => {
      const data = await apiFetch("/auth/login", {
        auth: false, // no bearer on login
        body: JSON.stringify({ email: (email || "").trim(), password })
      });
      if (data.token) setApiToken(data.token);
      if (data.user) setLocalUser(data.user);
      if (data.expiresIn) scheduleRefresh(Number(data.expiresIn));
      return data.user;
    },

    // Expect your backend to return: { token, user, expiresIn? }
    signup: async ({ name, email, password }) => {
      const data = await apiFetch("/auth/signup", {
        auth: false, // no bearer on signup
        body: JSON.stringify({ name, email: (email || "").trim(), password })
      });
      if (data.token) setApiToken(data.token);
      if (data.user) setLocalUser(data.user);
      if (data.expiresIn) scheduleRefresh(Number(data.expiresIn));
      return data.user;
    },

    // Best-effort logout; clear local regardless of server result
    logout: async () => {
      try {
        await apiFetchRaw("/auth/logout", {
          method: "POST",
          credentials: "include", // let server clear refresh cookie
          auth: false,
          headers: { [CSRF_HEADER]: getCsrfToken() },
          body: JSON.stringify({})
        });
      } catch {}
      clearApiToken();
      clearLocalUser();
    },

    // Typically { success: true }
    resetPassword: async (email) => {
      return apiFetch("/auth/reset-password", {
        auth: false,
        body: JSON.stringify({ email: (email || "").trim() })
      });
    }
  };
}

/* ------------------------------------ *
 * AUTH0 MODE IMPLEMENTATION
 * ------------------------------------ */
function useAuthAuth0() {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();

  const login = useCallback((opts) => loginWithRedirect?.(opts || {}), [loginWithRedirect]);
  const signup = useCallback(
    (opts) => loginWithRedirect?.({ ...opts, screen_hint: "signup" }),
    [loginWithRedirect]
  );
  const resetPassword = useCallback(
    (email) => {
      const domain = AUTH0_DOMAIN;
      const clientId = AUTH0_CLIENT_ID;
      if (!domain || !clientId) return;
      const url =
        `https://${domain}/u/reset-password?client_id=${clientId}` +
        (email ? `&email=${encodeURIComponent(String(email).trim())}` : "");
      window.location.assign(url);
    },
    []
  );

  return {
    isAuthenticated: !!isAuthenticated,
    isLoading: !!isLoading,
    user: user || null,
    login,
    signup,
    logout: (opts) => logout?.(opts ?? { returnTo: window.location.origin }),
    resetPassword
  };
}

/* ------------------------------------ *
 * NONE / DEFAULT MODE (browsing only)
 * ------------------------------------ */
function useAuthNone() {
  return {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    login: async () => {},
    signup: async () => {},
    logout: async () => {},
    resetPassword: async () => {}
  };
}

/* ------------------------------------ *
 * Export selected implementation
 * (decided at module load; no conditional hook calls)
 * ------------------------------------ */
export const useAuth = IS_AUTH0
  ? useAuthAuth0
  : IS_API
  ? useAuthApi
  : IS_LOCAL
  ? useAuthLocal
  : useAuthNone;

/* ---------------------- *
 * Guards
 * ---------------------- */
export function IfAuthenticated({ children, fallback = null }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? children : fallback;
}
export function IfAnonymous({ children, fallback = null }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return !isAuthenticated ? children : fallback;
}
export function RequireAuth({ children, redirectTo = "/" }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
    // Login/Signup will read location.state.from?.pathname and bounce back after auth
  }
  return children;
}
