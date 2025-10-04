// src/component/AuthSection.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { AUTH_MODE } from "../lib/config";

const AuthSection = ({ onLogout }) => {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();
  const location = useLocation();

  // Build a precise return path (supports nested routes, query, and hash)
  const returnPath =
    (location.pathname || "/") +
    (location.search || "") +
    (location.hash || "");

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      // Let Navbar decide where to send the user next
      onLogout?.();
    }
  };

  if (isLoading) {
    return (
      <div className="hidden md:flex items-center justify-center w-24 h-9">
        <svg
          className="animate-spin h-5 w-5 text-neutral-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    const baseBtn =
      "hidden md:inline-flex items-center justify-center rounded-xl border border-neutral-200 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

    // Auth0 → call hosted page, return to the exact current route after auth.
    if (AUTH_MODE === "auth0") {
      return (
        <button
          onClick={() => login({ returnTo: returnPath })}
          className={`${baseBtn} text-neutral-700 hover:bg-neutral-100`}
        >
          Sign in
        </button>
      );
    }

    // Local/API → link to our /login and pass state.from so we bounce back.
    return (
      <Link
        to="/login"
        state={{ from: location }}
        className={`${baseBtn} text-neutral-700 hover:bg-neutral-100`}
      >
        Sign in
      </Link>
    );
  }

  // Authenticated (any mode)
  const avatarSrc =
    user?.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || user?.email || "User"
    )}`;

  return (
    <div className="hidden md:flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-2 py-1">
        <img
          src={avatarSrc}
          alt={user?.name || user?.email || "User avatar"}
          className="h-6 w-6 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
        <span className="max-w-[12rem] truncate text-sm text-neutral-700">
          {user?.name || user?.email}
        </span>
      </div>
      <button
        onClick={handleLogout}
        title="Log out"
        className="inline-flex items-center justify-center rounded-xl bg-ink px-3 py-2 text-sm text-white hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Log out
      </button>
    </div>
  );
};

export default AuthSection;
