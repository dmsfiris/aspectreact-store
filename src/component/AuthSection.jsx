import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthSection = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <div className="h-9 w-24 rounded-xl bg-neutral-200 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => loginWithRedirect()}
        className="hidden md:inline-flex items-center justify-center rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-2 py-1">
        <img
          src={user?.picture}
          alt={user?.name || "User avatar"}
          className="h-6 w-6 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
        <span className="max-w-[12rem] truncate text-sm text-neutral-700">
          {user?.name || user?.email}
        </span>
      </div>
      <button
        onClick={() => logout({ returnTo: window.location.origin })}
        className="inline-flex items-center justify-center rounded-xl bg-ink px-3 py-2 text-sm text-white hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Log out
      </button>
    </div>
  );
};

export default AuthSection;
