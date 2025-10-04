import React from "react";
import { APP_NAME } from "../lib/config";

const About = () => {
  return (
    <article className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-card p-8 sm:p-10">
        <h1 className="font-display text-3xl font-semibold text-ink">
          About {APP_NAME}
        </h1>
        <p className="mt-3 text-neutral-600">
          {APP_NAME} is a clean, modern demo e-shop focused on a fast, delightful browsing
          experience. It showcases a responsive product grid, a streamlined cart, and a
          simple checkout flow.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            ["Purpose", "Demonstrate a polished single-store e-commerce UI."],
            ["Tech", "React, React Router, Tailwind, react-use-cart, Auth0."],
            ["Scope", "Front-end only—no real payments or backend APIs."],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="rounded-xl border border-neutral-200 bg-white shadow-sm p-5"
            >
              <h3 className="text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-neutral-200 bg-white shadow-sm p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            What’s inside
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-700">
            <li>Filterable, sortable catalog with quick “Add to cart”.</li>
            <li>Accessible, mobile-first forms and components.</li>
            <li>Optional login/logout with Auth0 for UI personalization.</li>
          </ul>
        </div>

        <p className="mt-8 text-sm text-neutral-500">
          Note: This is a UI demo. To make it production-ready, connect a payments
          provider (e.g., Stripe) and persist orders in a backend.
        </p>
      </div>
    </article>
  );
};

export default About;
