/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { AUTH_MODE } from "../lib/config";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  // --- Auth0 mode: no form, just the hosted login button ---
  if (AUTH_MODE === "auth0") {
    return (
      <section className="mx-auto max-w-md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
          <p className="mt-2 text-sm text-neutral-600">
            You’ll be redirected to our secure sign-in page.
          </p>
          <button
            onClick={() => login({ returnTo: from })}
            className="mt-6 w-full rounded-xl bg-ink px-4 py-2 text-white hover:bg-neutral-900"
          >
            Continue with Auth0
          </button>
          <p className="mt-4 text-xs text-neutral-500">
            We’ll send you back to <span className="font-medium">{from}</span> after signing in.
          </p>
        </div>
      </section>
    );
  }

  // --- Local/API modes (your existing form) ---
  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!form.email || !form.password) {
        throw new Error("Please provide email and password");
      }
      await login({
        email: form.email.trim(),
        password: form.password,
        returnTo: from,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const showPassword = true;

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8">
        <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Create one
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
              placeholder="you@example.com"
            />
          </label>

          {showPassword && (
            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                placeholder="••••••••"
              />
            </label>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-ink px-4 py-2 text-white hover:bg-neutral-900 disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-sm text-neutral-600">
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
