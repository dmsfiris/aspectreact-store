/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../lib/auth";
import { AUTH_MODE } from "../lib/config";

const AUTO_REDIRECT_MS = 5000;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Where to send user after reset flow
  const from = location.state?.from?.pathname || "/login";

  // Keep a timeout ref so we can clean it up on unmount or re-submit
  const redirectTimerRef = useRef(null);

  // Basic client-side email check to disable submit early
  const emailValid = /\S+@\S+\.\S+/.test(email.trim());

  useEffect(() => {
    if (sent && AUTH_MODE !== "auth0") {
      redirectTimerRef.current = setTimeout(() => {
        navigate(from, { replace: true });
        redirectTimerRef.current = null;
      }, AUTO_REDIRECT_MS);
    }
    // Cleanup on unmount or when dependencies change
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    };
  }, [sent, navigate, from]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Cancel any existing scheduled redirect if user resubmits
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }

    try {
      const trimmedEmail = email.trim();

      if (AUTH_MODE === "auth0") {
        // Auth0: immediate redirect to hosted reset page
        await resetPassword(trimmedEmail);
        return;
      }

      if (AUTH_MODE === "local") {
        // Local demo mode: simulate reset email
        console.log(`[Demo] Simulated reset request for: ${trimmedEmail}`);
        setSent(true);
        toast.success(`Password reset email simulated for ${trimmedEmail}`);
      }

      if (AUTH_MODE === "api") {
        // API: call backend via useAuth
        await resetPassword(trimmedEmail);
        setSent(true);
        toast.success(`Password reset email sent to ${trimmedEmail}`);
      }
    } catch (err) {
      setError(err.message || "Password reset failed");
    } finally {
      setSubmitting(false);
    }
  }

  // Disable inputs after we’ve shown the “sent” confirmation for local/api
  const lockForm = submitting || (sent && AUTH_MODE !== "auth0");

  return (
    <section className="mx-auto max-w-md">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8">
        <h1 className="text-2xl font-semibold text-ink">Reset your password</h1>

        {sent && AUTH_MODE !== "auth0" ? (
          <>
            <p role="status" aria-live="polite" className="mt-6 text-sm text-success">
              If this were real, a reset email would be sent to{" "}
              <strong>{email}</strong>.
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              We’ll automatically take you back in{" "}
              {Math.floor(AUTO_REDIRECT_MS / 1000)} seconds.
            </p>
            <div className="mt-4 text-sm text-neutral-600">
              <button
                onClick={() => navigate(from, { replace: true })}
                className="text-primary hover:underline"
              >
                Continue now
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <fieldset disabled={lockForm} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trimStart())}
                  required
                  className="mt-1 w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  placeholder="you@example.com"
                />
              </label>

              {error && (
                <p role="alert" className="text-sm text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={lockForm || !emailValid || submitting}
                className="w-full rounded-xl bg-ink px-4 py-2 text-white hover:bg-neutral-900 disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Send reset link"}
              </button>
            </fieldset>
          </form>
        )}

        <div className="mt-4 text-sm text-neutral-600">
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </div>

        {AUTH_MODE === "local" && (
          <p className="mt-3 text-xs text-neutral-500">
            Demo mode: no real emails are sent — this simulates the flow.
          </p>
        )}
        {AUTH_MODE === "api" && (
          <p className="mt-3 text-xs text-neutral-500">
            API mode: this calls your backend’s <code>/auth/reset-password</code>.
          </p>
        )}
      </div>
    </section>
  );
};

export default ForgotPassword;
