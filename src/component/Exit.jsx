import React from "react";
import { Link } from "react-router-dom";

const Exit = () => {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-neutral-100 grid place-items-center">
          <span className="material-symbols-outlined text-2xl text-neutral-700">
            check_circle
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-ink">Order confirmed</h1>
        <p className="mt-2 text-neutral-600">
          Thank you for your purchase! This is a demo flow—no payment was processed.
          You’ll receive a confirmation screen only.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/product"
            className="rounded-xl bg-ink px-6 py-3 text-white hover:bg-neutral-900"
          >
            Continue shopping
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-neutral-300 px-6 py-3 text-neutral-700 hover:bg-neutral-50"
          >
            Back to home
          </Link>
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          Tip: Connect a real payment provider (e.g., Stripe Checkout) and persist
          orders to make this screen display an order number and email receipt.
        </p>
      </div>
    </div>
  );
};

export default Exit;
