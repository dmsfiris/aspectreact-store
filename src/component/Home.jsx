import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../lib/config";

const Home = () => {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600">
              New season · Just dropped
            </span>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {APP_NAME} — a clean, premium React e-shop.
            </h1>
            <p className="mt-3 text-neutral-600">
              Curated products, crisp design, and fast browsing. Add to cart in one
              click and experience a streamlined frontend checkout demo—no sign-up required.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/product"
                className="inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-white hover:bg-neutral-900"
              >
                Explore products
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-6 py-3 text-neutral-700 hover:bg-neutral-50"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute -right-16 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-[2rem] bg-gradient-to-br from-primary/20 via-white to-sale/20 blur-2xl md:block"
          aria-hidden="true"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Fast checkout", "Streamlined demo flow—no payment required."],
          ["Responsive design", "Beautiful on phones, tablets, and desktops."],
          ["Built with React", "Modern front-end using React + Tailwind."],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-2xl border border-neutral-200 bg-white p-5"
          >
            <h3 className="font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;
