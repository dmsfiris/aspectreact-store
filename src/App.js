/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "react-use-cart";
import { Toaster, toast } from "react-hot-toast";

import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Product from "./component/Product";
import Cart from "./component/Cart";
import Checkout from "./component/Checkout";
import About from "./component/About";
import Contact from "./component/Contact";
import Exit from "./component/Exit";
import AuthSection from "./component/AuthSection";
import ProtectedPage from "./component/ProtectedPage";
import NotFound from "./component/NotFound";

import Login from "./component/Login";
import Signup from "./component/Signup";
import ForgotPassword from "./component/ForgotPassword";

import { APP_NAME, AUTH_MODE } from "./lib/config";
import { RequireAuth, useAuth, getUserId } from "./lib/auth";

/* ---------------- Footer ---------------- */
const Footer = () => {
  const location = useLocation();
  const footerLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  const isRouteActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <footer className="border-t border-neutral-200 py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-sm text-neutral-600">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>

          <nav className="flex gap-4" aria-label="Footer">
            {footerLinks.map((link) => {
              const isActive = isRouteActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`transition-colors ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-neutral-600 hover:text-ink"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <a
              href="https://tailwindcss.com/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors text-neutral-600 hover:text-ink"
            >
              Built with Tailwind
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

/* --------- Cart key helpers & merge --------- */
const GUEST_KEY = "cart_guest";
const makeUserKey = (uid) => `cart_${uid}`;

function readCart(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeCart(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}
function removeCart(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

// Merge guest items into target cart and recompute totals.
function mergeCarts(guest, target) {
  const gItems = guest?.items || [];
  const tItems = target?.items || [];
  const byId = new Map();

  for (const it of tItems) {
    if (!it || it.id == null) continue;
    byId.set(it.id, { ...it });
  }
  for (const it of gItems) {
    if (!it || it.id == null) continue;
    const existing = byId.get(it.id);
    if (existing) {
      byId.set(it.id, {
        ...existing,
        quantity: (existing.quantity || 0) + (it.quantity || 0),
      });
    } else {
      byId.set(it.id, { ...it });
    }
  }

  const items = Array.from(byId.values());
  const totalItems = items.reduce((acc, it) => acc + (it.quantity || 0), 0);
  const cartTotal = items.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (it.quantity || 0),
    0
  );
  const totalUniqueItems = items.length;
  const isEmpty = items.length === 0;

  return {
    ...(target || {}),
    items,
    totalItems,
    totalUniqueItems,
    cartTotal,
    isEmpty,
  };
}

/* ---------------- App with per-user cart & auto-merge ---------------- */
const AppWrapper = () => {
  const { user } = useAuth();
  const userId = getUserId(user);

  const [cartKey, setCartKey] = useState(
    userId ? makeUserKey(userId) : GUEST_KEY
  );
  const prevUserIdRef = useRef(userId);

  useEffect(() => {
    const prevUserId = prevUserIdRef.current;

    // Guest -> Logged in: merge guest cart into user cart
    if (!prevUserId && userId) {
      const targetKey = makeUserKey(userId);
      const guestCart = readCart(GUEST_KEY) || { items: [] };
      const userCart = readCart(targetKey) || { items: [] };

      if ((guestCart.items?.length || 0) > 0) {
        const merged = mergeCarts(guestCart, userCart);
        writeCart(targetKey, merged);
        removeCart(GUEST_KEY);
        toast.success("We merged your guest cart with your account!");
      }

      setCartKey(targetKey);
    }

    // Logged in -> Logged out: switch back to guest cart
    if (prevUserId && !userId) {
      setCartKey(GUEST_KEY);
    }

    prevUserIdRef.current = userId;
  }, [userId]);

  const redirectForProtected = AUTH_MODE === "auth0" ? "/" : "/login";

  return (
    <CartProvider id={cartKey}>
      <Router>
        <div className="min-h-screen bg-neutral-50 text-ink">
          <Toaster position="bottom-right" />

          <Navbar />

          <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />

              {/* Auth pages (ONLY in local/api modes) */}
              {AUTH_MODE !== "auth0" && (
                <>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </>
              )}

              {/* Protected routes */}
              <Route
                path="/checkout"
                element={
                  <RequireAuth redirectTo={redirectForProtected}>
                    <Checkout />
                  </RequireAuth>
                }
              />
              <Route
                path="/exit"
                element={
                  <RequireAuth redirectTo={redirectForProtected}>
                    <Exit />
                  </RequireAuth>
                }
              />
              <Route
                path="/protected"
                element={
                  <RequireAuth redirectTo={redirectForProtected}>
                    <ProtectedPage />
                  </RequireAuth>
                }
              />

              {/* Demo/testing */}
              <Route path="/authSection" element={<AuthSection />} />

              {/* 404 catch-all (last) */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default AppWrapper;
