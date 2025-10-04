/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_NAME, SUPPORT_EMAIL } from "../lib/config";

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `404 — Page Not Found | ${APP_NAME}`;
    setMeta("robots", "noindex,follow");
    setMeta(
      "description",
      "The page you’re looking for was not found. Explore products, learn about us, or contact support."
    );
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const path =
    typeof window !== "undefined" ? window.location.pathname : "/nonexistent";
  const subject = `Broken link: ${path}`;
  const mailto = `mailto:${encodeURIComponent(
    SUPPORT_EMAIL
  )}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-card">
        <p className="text-sm tracking-wide text-neutral-500">Error 404</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
          We couldn’t find that page
        </h1>
        <p className="mt-2 text-neutral-600">
          The requested address{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5">{path}</code>{" "}
          doesn’t exist. It might have been moved or the link could be
          incorrect.
        </p>

        <div className="mt-6 grid gap-3 sm:flex">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-4 py-2 text-ink hover:bg-neutral-50"
          >
            Go back
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-ink px-4 py-2 text-white hover:bg-neutral-900"
          >
            Go to homepage
          </Link>
          <Link
            to="/product"
            className="inline-flex items-center justify-center rounded-xl bg-neutral-900/80 px-4 py-2 text-white hover:bg-neutral-900"
          >
            Browse products
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-4 py-2 text-ink hover:bg-neutral-50"
          >
            Contact us
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Popular destinations
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            <li>
              <Link
                className="block rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50"
                to="/product"
              >
                Shop / Products
              </Link>
            </li>
            <li>
              <Link
                className="block rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50"
                to="/about"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                className="block rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50"
                to="/cart"
              >
                Your cart
              </Link>
            </li>
            <li>
              <Link
                className="block rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50"
                to="/login"
              >
                Sign in
              </Link>
            </li>
          </ul>
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          If you believe this is a broken link, please{" "}
          <a className="underline hover:no-underline" href={mailto}>
            report it to {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
