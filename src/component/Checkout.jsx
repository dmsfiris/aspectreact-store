// src/component/Checkout.jsx
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
    country: "",
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
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Enter a valid email";
    if (!form.address1.trim()) e.address1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (!form.agree) e.agree = "You must agree to continue";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600)); // demo delay
      emptyCart();
      navigate("/exit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">
        Checkout
      </h1>

      {isAuthenticated && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary shadow-card">
          Signed in as{" "}
          <span className="font-medium">{user?.name}</span> ({user?.email})
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-ink">
              Contact
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* First name */}
              <label className="block">
                <span className="text-sm font-medium">First name</span>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  aria-describedby={
                    errors.firstName ? "firstName-error" : undefined
                  }
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.firstName && (
                  <p
                    id="firstName-error"
                    className="mt-1 text-xs text-danger"
                  >
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
                  aria-describedby={
                    errors.lastName ? "lastName-error" : undefined
                  }
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
          {/* (kept as-is from your version — unchanged) */}
          {/* ... */}
        </form>

        {/* Order summary */}
        {/* (also unchanged — just as in your version) */}
      </div>
    </div>
  );
};

export default Checkout;
