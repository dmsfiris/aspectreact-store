import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../lib/config";

const Home = () => {
  return (
    <main className="mx-auto max-w-7xl">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600">
              New season · Just dropped
            </span>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl sm:leading-snug">
              {APP_NAME} — a modern React e-commerce demo.
            </h1>
            <p className="mt-3 text-neutral-600">
              A polished front-end project built with React + TailwindCSS.  
              Browse curated products, add to cart in one click, and experience a fast checkout flow — no payment required.  
              Perfect as a portfolio showcase.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/product"
                aria-label="Browse all products"
                className="inline-flex items-center justify-center rounded-xl bg-ink px-6 py-3 text-white shadow-sm hover:bg-neutral-900 hover:shadow-card transition"
              >
                Explore products
              </Link>
              <Link
                to="/about"
                aria-label="Learn more about this project"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-6 py-3 text-neutral-700 hover:bg-neutral-50 transition"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gradient blob */}
        <div
          className="pointer-events-none absolute -right-16 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-[2rem] bg-gradient-to-br from-primary/20 via-white to-sale/20 blur-2xl md:block"
          aria-hidden="true"
        />
      </div>

      {/* Features */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Fast checkout", "Streamlined demo flow—no payment required."],
          ["Responsive design", "Looks great on phones, tablets, and desktops."],
          ["Built with React", "Modern front-end using React + TailwindCSS."],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-2xl border border-neutral-200 bg-white p-5 hover:shadow-card transition"
          >
            <h3 className="font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
