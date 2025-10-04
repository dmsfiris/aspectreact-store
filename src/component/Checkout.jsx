/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { formatCurrency } from "../lib/format";
import { useAuth } from "../lib/auth";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, isEmpty, emptyCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "GR", // default to Greece
    agree: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Prefill user info if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((f) => ({
        ...f,
        firstName: user.name?.split(" ")[0] || f.firstName,
        lastName: user.name?.split(" ")[1] || f.lastName,
        email: user.email || f.email,
      }));
    }
  }, [user, isAuthenticated]);

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-card">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Your cart is empty
          </h1>
        <p className="mt-1 text-neutral-600">
            Add some products to proceed to checkout.
          </p>
          <Link
            to="/product"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-ink px-5 py-3 text-white hover:bg-neutral-900"
          >
            Go to shop
          </Link>
        </div>
      </div>
    );
  }

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.address1.trim()) e.address1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (!form.agree) e.agree = "You must agree to continue";
    return e;
  }

  const canSubmit = (() => {
    // compute validity without mutating state
    const v = {};
    if (!form.firstName.trim()) v.firstName = true;
    if (!form.lastName.trim()) v.lastName = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) v.email = true;
    if (!form.address1.trim()) v.address1 = true;
    if (!form.city.trim()) v.city = true;
    if (!form.zip.trim()) v.zip = true;
    if (!form.country.trim()) v.country = true;
    if (!form.agree) v.agree = true;
    return !Object.keys(v).length && !submitting;
  })();

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // prevent double-submit
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      setSubmitting(true);
      // Simulate processing; replace with API/payment call
      await new Promise((r) => setTimeout(r, 600));
      emptyCart();
      navigate("/exit");
    } finally {
      setSubmitting(false);
    }
  }

  // Build a concise error summary for screen readers
  const errorKeys = Object.keys(errors);
  const hasErrors = errorKeys.length > 0;

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Checkout</h1>

      {isAuthenticated && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary shadow-card">
          Signed in as <span className="font-medium">{user?.name}</span> ({user?.email})
        </div>
      )}

      {/* Error summary for screen readers */}
      <div aria-live="polite" role="status" className="sr-only">
        {hasErrors ? `Form has ${errorKeys.length} error${errorKeys.length > 1 ? "s" : ""}.` : ""}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6" noValidate>
          {/* Contact info */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* First name */}
              <label className="block">
                <span className="text-sm font-medium">First name</span>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.firstName && (
                  <p id="firstName-error" className="mt-1 text-xs text-danger">
                    {errors.firstName}
                  </p>
                )}
              </label>

              {/* Last name */}
              <label className="block">
                <span className="text-sm font-medium">Last name</span>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.lastName && (
                  <p id="lastName-error" className="mt-1 text-xs text-danger">
                    {errors.lastName}
                  </p>
                )}
              </label>

              {/* Email */}
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-danger">
                    {errors.email}
                  </p>
                )}
              </label>

              {/* Phone */}
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Phone (optional)</span>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                />
              </label>
            </div>
          </section>

          {/* Shipping address */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-ink">Shipping address</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Address 1 */}
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Address line 1</span>
                <input
                  name="address1"
                  value={form.address1}
                  onChange={handleChange}
                  autoComplete="address-line1"
                  aria-invalid={!!errors.address1}
                  aria-describedby={errors.address1 ? "address1-error" : undefined}
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.address1 && (
                  <p id="address1-error" className="mt-1 text-xs text-danger">
                    {errors.address1}
                  </p>
                )}
              </label>

              {/* Address 2 */}
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Address line 2 (optional)</span>
                <input
                  name="address2"
                  value={form.address2}
                  onChange={handleChange}
                  autoComplete="address-line2"
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                />
              </label>

              {/* City */}
              <label className="block">
                <span className="text-sm font-medium">City</span>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? "city-error" : undefined}
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.city && (
                  <p id="city-error" className="mt-1 text-xs text-danger">
                    {errors.city}
                  </p>
                )}
              </label>

              {/* State/Region */}
              <label className="block">
                <span className="text-sm font-medium">State/Region</span>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  autoComplete="address-level1"
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                />
              </label>

              {/* ZIP */}
              <label className="block">
                <span className="text-sm font-medium">ZIP / Postal code</span>
                <input
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  aria-invalid={!!errors.zip}
                  aria-describedby={errors.zip ? "zip-error" : undefined}
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.zip && (
                  <p id="zip-error" className="mt-1 text-xs text-danger">
                    {errors.zip}
                  </p>
                )}
              </label>

              {/* Country */}
              <label className="block">
                <span className="text-sm font-medium">Country</span>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  aria-invalid={!!errors.country}
                  aria-describedby={errors.country ? "country-error" : undefined}
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                >
                  <option value="">Select…</option>
                  <option value="GR">Greece</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                </select>
                {errors.country && (
                  <p id="country-error" className="mt-1 text-xs text-danger">
                    {errors.country}
                  </p>
                )}
              </label>

              {/* Terms */}
              <label className="mt-2 flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-neutral-700">
                  I agree to the terms and conditions
                </span>
              </label>
              {errors.agree && (
                <p className="text-xs text-danger sm:col-span-2">{errors.agree}</p>
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-ink px-5 py-3 text-white shadow-card disabled:opacity-60 hover:bg-neutral-900"
            aria-busy={submitting ? "true" : "false"}
          >
            {submitting ? "Processing…" : "Place order"}
          </button>
        </form>

        {/* Order summary */}
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Order summary</h2>
          <ul className="divide-y">
            {items.map((it) => (
              <li key={it.id} className="py-3 flex items-start justify-between">
                <div className="mr-4">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-neutral-600">Qty: {it.quantity}</div>
                </div>
                <div className="text-right font-medium">
                  {formatCurrency((it.price || 0) * (it.quantity || 0))}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(cartTotal || 0)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
