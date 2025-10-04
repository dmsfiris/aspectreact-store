/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React, { useMemo, useState } from "react";
import { useCart } from "react-use-cart";
import prodData from "../data/prodData";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { formatCurrency } from "../lib/format";

const SORTS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: High to Low", value: "rating-desc" },
];

function ProductCard({ product, onAdd }) {
  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-4 shadow-card hover:shadow-hover transition-all">
      <div className="aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="line-clamp-2 font-medium text-ink">{product.title}</h3>
        <p className="text-sm text-neutral-500">{product.category}</p>
        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
          {product?.rating?.rate != null && (
            <div className="flex items-center gap-1 text-sm text-neutral-600">
              <span aria-hidden>★</span>
              <span>{product.rating.rate}</span>
              {product?.rating?.count != null && (
                <span className="text-neutral-400">({product.rating.count})</span>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onAdd(product)}
        aria-label={`Add ${product.title} to cart`}
        className="mt-4 w-full rounded-xl bg-ink text-white py-2.5 text-sm font-medium hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Add to cart
      </button>
    </div>
  );
}

const Product = () => {
  const { addItem } = useCart();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const categories = useMemo(() => {
    const set = new Set(prodData.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, []);

  const products = useMemo(() => {
    let list = [...prodData];

    if (category !== "All") list = list.filter((p) => p.category === category);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        list.sort((a, b) => (b?.rating?.rate ?? 0) - (a?.rating?.rate ?? 0));
        break;
      default:
        break;
    }

    return list;
  }, [category, query, sort]);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header / filters */}
      <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Shop</h1>
            <p className="text-neutral-600">Explore our latest products.</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            {/* Search */}
            <label className="relative block sm:w-72">
              <span className="sr-only">Search products</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-xl border-neutral-300 bg-white pr-10 focus:border-primary focus:ring-primary"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-neutral-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </label>

            {/* Category */}
            <label className="sm:w-48">
              <span className="sr-only">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border-neutral-300 bg-white focus:border-primary focus:ring-primary"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            {/* Sort */}
            <label className="sm:w-56">
              <span className="sr-only">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border-neutral-300 bg-white focus:border-primary focus:ring-primary"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-3 py-2 text-neutral-700 hover:bg-neutral-100 sm:hidden"
              aria-hidden="true"
              tabIndex={-1}
            >
              <HiOutlineAdjustmentsHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Result meta */}
      <div className="mb-4 text-sm text-neutral-600">
        Showing <span className="font-medium">{products.length}</span>{" "}
        {products.length === 1 ? "item" : "items"}
        {category !== "All" && (
          <>
            {" "}
            in <span className="font-medium">{category}</span>
          </>
        )}
        {query && (
          <>
            {" "}
            for “<span className="font-medium">{query}</span>”
          </>
        )}
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-card">
          <p className="text-lg font-medium">No products found</p>
          <p className="mt-1 text-neutral-500">Try adjusting filters or search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
