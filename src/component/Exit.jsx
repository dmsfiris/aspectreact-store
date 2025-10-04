// src/component/Exit.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

const Exit = () => {
  const { user, isAuthenticated } = useAuth();
  const displayName = isAuthenticated ? user?.name : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-card">
        {/* Success badge */}
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-success/10">
          <svg
            className="h-8 w-8 text-success"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-30"
            />
            <path
              d="M8.5 12.5l2.5 2.5 4.5-5.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="font-display text-2xl font-semibold text-ink">Order confirmed</h1>
        <p className="mt-2 text-neutral-600">
          Thank you{displayName ? `, ${displayName}` : ""}, for your purchase!
          <br />
          This is a demo flow — no payment was processed.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/product"
            className="rounded-xl bg-ink px-6 py-3 text-white transition hover:bg-neutral-900"
          >
            Continue shopping
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-neutral-300 px-6 py-3 text-neutral-700 transition hover:bg-neutral-50"
          >
            Back to home
          </Link>
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          Tip: Connect a real payment provider (e.g., Stripe Checkout) and persist
          orders to display an order number and email receipt here.
        </p>
      </div>
    </div>
  );
};

export default Exit;
