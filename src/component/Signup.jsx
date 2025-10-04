/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { AUTH_MODE } from "../lib/config";

const isAuthPath = (p = "") =>
  p.startsWith("/login") || p.startsWith("/signup") || p.startsWith("/forgot-password");

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Compute safe redirect target
  const rawFrom =
    typeof location.state?.from === "string"
      ? location.state.from
      : location.state?.from?.pathname;

  const from = rawFrom && !isAuthPath(rawFrom) ? rawFrom : "/";

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (AUTH_MODE === "auth0") {
        // Redirect to Auth0 signup page
        await signup({ returnTo: from });
      } else {
        // Local / API signup
        const email = form.email.trim();
        if (!form.name || !email || !form.password) {
          throw new Error("Please fill in all fields.");
        }
        if (form.password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }

        await signup({
          email,
          password: form.password,
          name: form.name,
        });

        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const showLocalOrApiFields = AUTH_MODE === "local" || AUTH_MODE === "api";

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8">
        <h1 className="text-2xl font-semibold text-ink">Create an account</h1>

        {AUTH_MODE === "auth0" ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-neutral-600">
              Sign up securely using our Auth0 provider.
            </p>
            <button
              onClick={() => signup({ returnTo: from })}
              disabled={submitting}
              className="w-full rounded-xl bg-ink px-4 py-2 text-white hover:bg-neutral-900 disabled:opacity-50"
            >
              Continue with Auth0
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Name */}
            <label className="block">
              <span className="text-sm font-medium">Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                placeholder="Jane Doe"
              />
            </label>

            {/* Email */}
            {showLocalOrApiFields && (
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
            )}

            {/* Password */}
            {showLocalOrApiFields && (
              <label className="block">
                <span className="text-sm font-medium">Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
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
              {submitting ? "Signing up…" : "Sign up"}
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-neutral-600">
          Already have an account?{" "}
          <Link
            to="/login"
            state={{ from }}
            className="text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Signup;
