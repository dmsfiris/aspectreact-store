/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "react-use-cart";
import { Toaster, toast } from "react-hot-toast";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import ScrollToTop from "./component/ScrollToTop";
import BackToTop from "./component/BackToTop";

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

import { AUTH_MODE } from "./lib/config";
import { RequireAuth, useAuth, getUserId } from "./lib/auth";

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

    // Logged in -> Logged in as a different user (account switch)
    if (prevUserId && userId && prevUserId !== userId) {
      setCartKey(makeUserKey(userId));
    }

    // Logged in -> Logged out: switch back to guest cart
    if (prevUserId && !userId) {
      setCartKey(GUEST_KEY);
    }

    prevUserIdRef.current = userId;
  }, [userId]);

  const redirectForProtected = AUTH_MODE === "auth0" ? "/" : "/login";

  return (
    // key={cartKey} forces a clean remount on key change (prevents state leakage)
    <CartProvider id={cartKey} key={cartKey}>
      <Router>
        <div className="min-h-screen bg-neutral-50 text-ink">
          <Toaster position="bottom-right" />

          <Navbar />
          <ScrollToTop />

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

          {/* Floating “Back to top” button (appears after scrolling ~400px) */}
          <BackToTop threshold={400} />

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default AppWrapper;
