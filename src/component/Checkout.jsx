import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { formatCurrency } from "../lib/format";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, isEmpty, emptyCart } = useCart();

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

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold text-ink">Your cart is empty</h1>
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
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
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
      await new Promise((r) => setTimeout(r, 600));
      emptyCart();
      navigate("/exit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-ink">Contact</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">First name</span>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-danger">{errors.firstName}</p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium">Last name</span>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-danger">{errors.lastName}</p>
                )}
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-danger">{errors.email}</p>
                )}
              </label>

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

          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-ink">Shipping address</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Address line 1</span>
                <input
                  name="address1"
                  value={form.address1}
                  onChange={handleChange}
                  autoComplete="address-line1"
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.address1 && (
                  <p className="mt-1 text-xs text-danger">{errors.address1}</p>
                )}
              </label>

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

              <label className="block">
                <span className="text-sm font-medium">City</span>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-danger">{errors.city}</p>
                )}
              </label>

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

              <label className="block">
                <span className="text-sm font-medium">ZIP / Postal code</span>
                <input
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.zip && (
                  <p className="mt-1 text-xs text-danger">{errors.zip}</p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium">Country</span>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  autoComplete="country-name"
                  className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                  required
                />
                {errors.country && (
                  <p className="mt-1 text-xs text-danger">{errors.country}</p>
                )}
              </label>
            </div>

            <label className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-neutral-700">
                I agree to the terms and conditions.
              </span>
            </label>
            {errors.agree && (
              <p className="mt-1 text-xs text-danger">{errors.agree}</p>
            )}
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              to="/cart"
              className="rounded-xl border border-neutral-300 px-5 py-3 text-center text-neutral-700 hover:bg-neutral-50"
            >
              Back to cart
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-ink px-6 py-3 font-medium text-white hover:bg-neutral-900 disabled:opacity-60"
            >
              {submitting ? "Placing order…" : "Place order"}
            </button>
          </div>
        </form>

        {/* Order summary */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-ink">Order Summary</h2>

            <ul className="mt-4 space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-ink">
                      {item.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 h-px w-full bg-neutral-200" />

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-600">Subtotal</dt>
                <dd className="font-medium">{formatCurrency(cartTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Shipping</dt>
                <dd className="text-neutral-500">Calculated at next step</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Taxes</dt>
                <dd className="text-neutral-500">Calculated at next step</dd>
              </div>
              <div className="mt-3 h-px w-full bg-neutral-200" />
              <div className="flex justify-between text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-semibold">{formatCurrency(cartTotal)}</dd>
              </div>
            </dl>

            <p className="mt-3 text-xs text-neutral-500">
              This is a demo checkout. No payment will be processed.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
