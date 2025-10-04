/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React from "react";
import { useAuth } from "../lib/auth";

const ProtectedPage = () => {
  const { user, isAuthenticated } = useAuth();

  // Always require auth: if no user, show fallback text
  const displayName = isAuthenticated
    ? user?.name || user?.email || "User"
    : "Guest";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-md">
        <h1 className="text-2xl font-semibold text-ink">🔒 Protected Content</h1>
        <p className="mt-3 text-neutral-600">
          Welcome, <span className="font-medium">{displayName}</span>!
        </p>
        <p className="mt-1 text-neutral-500">
          This page is only accessible when signed in.
        </p>

        <div className="mt-6 text-sm text-neutral-500">
          <p>
            In a real project, this could be account settings, order history,
            or admin-only content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedPage;
