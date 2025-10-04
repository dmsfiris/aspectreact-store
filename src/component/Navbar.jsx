/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React from "react";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useCart } from "react-use-cart";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthSection from "./AuthSection";
import eCom from "../assets/eCom.png";
import { APP_NAME, AUTH_MODE } from "../lib/config";
import { useAuth } from "../lib/auth";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/product" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const { isEmpty, totalItems } = useCart();
  const { isAuthenticated, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  // Nested route highlighting (e.g., /product/123)
  const isRouteActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      {/* key={location.pathname} ensures the Disclosure remounts (auto-closes) on route change */}
      <Disclosure as="nav" key={location.pathname}>
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-3">
                  <Link to="/" className="flex items-center gap-2" aria-label={`${APP_NAME} home`}>
                    <img
                      src={eCom}
                      alt={`${APP_NAME} logo`}
                      className="h-8 w-8"
                      width="32"
                      height="32"
                      loading="eager"
                    />
                    <span className="font-display text-xl tracking-tight text-ink">
                      {APP_NAME}
                    </span>
                  </Link>
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6">
                  {navigation.map((item) => {
                    const isActive = isRouteActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={classNames(
                          "text-sm px-2 py-1 rounded-lg transition-colors",
                          isActive
                            ? "text-primary font-medium"
                            : "text-neutral-600 hover:text-ink"
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}

                  {/* Protected link (only when logged in) */}
                  {isAuthenticated && (
                    <Link
                      to="/protected"
                      aria-current={isRouteActive("/protected") ? "page" : undefined}
                      className={classNames(
                        "flex items-center gap-1 text-sm px-2 py-1 rounded-lg transition-colors",
                        isRouteActive("/protected")
                          ? "text-primary font-medium"
                          : "text-neutral-600 hover:text-ink"
                      )}
                    >
                      <LockClosedIcon className="h-4 w-4" />
                      Protected
                    </Link>
                  )}
                </nav>

                {/* Right side: Cart + Auth + Mobile menu */}
                <div className="flex items-center gap-2">
                  <Link
                    to="/cart"
                    aria-current={isRouteActive("/cart") ? "page" : undefined}
                    className={classNames(
                      "relative rounded-xl border border-neutral-200 px-3 py-2 hover:shadow-card transition",
                      isRouteActive("/cart") && "ring-2 ring-primary"
                    )}
                    aria-label="Open cart"
                    title="Cart"
                  >
                    <HiOutlineShoppingCart className="h-5 w-5 text-neutral-700" />
                    {!isEmpty && (
                      <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 grid h-5 min-w-[20px] place-items-center rounded-full bg-primary text-white text-xs px-1">
                        {totalItems}
                      </span>
                    )}
                  </Link>

                  {/* Desktop: AuthSection handles its own mode */}
                  <AuthSection onLogout={handleLogout} />

                  <div className="md:hidden">
                    <Disclosure.Button
                      className="ml-1 inline-flex items-center justify-center rounded-xl border border-neutral-200 p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label={open ? "Close menu" : "Open menu"}
                    >
                      <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile panel */}
            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-3 pb-3 pt-2">
                {navigation.map((item) => {
                  const isActive = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={classNames(
                        "block rounded-lg px-3 py-2 text-base font-medium",
                        isActive
                          ? "text-primary font-medium"
                          : "text-neutral-700 hover:bg-neutral-100 hover:text-ink"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {/* Protected link */}
                {isAuthenticated && (
                  <Link
                    to="/protected"
                    aria-current={isRouteActive("/protected") ? "page" : undefined}
                    className={classNames(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium",
                      isRouteActive("/protected")
                        ? "text-primary font-medium"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-ink"
                    )}
                  >
                    <LockClosedIcon className="h-5 w-5" />
                    <span>Protected</span>
                  </Link>
                )}

                {/* Mobile auth controls */}
                {!isAuthenticated && (
                  <>
                    {AUTH_MODE === "auth0" ? (
                      <button
                        onClick={() => login({ returnTo: location.pathname })}
                        className="block w-full rounded-lg border border-neutral-300 px-3 py-2 text-left text-base font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        Sign in
                      </button>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          state={{ from: location }}
                          className={classNames(
                            "block rounded-lg px-3 py-2 text-base font-medium",
                            isRouteActive("/login")
                              ? "text-primary font-medium"
                              : "text-neutral-700 hover:bg-neutral-100 hover:text-ink"
                          )}
                        >
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          state={{ from: location }}
                          className={classNames(
                            "block rounded-lg px-3 py-2 text-base font-medium",
                            isRouteActive("/signup")
                              ? "text-primary font-medium"
                              : "text-neutral-700 hover:bg-neutral-100 hover:text-ink"
                          )}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </>
                )}

                {/* Mobile-only Logout */}
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-left text-base font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Log out
                  </button>
                )}

                <Link
                  to="/cart"
                  aria-current={isRouteActive("/cart") ? "page" : undefined}
                  className={classNames(
                    "mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium",
                    isRouteActive("/cart")
                      ? "text-primary font-medium"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-ink"
                  )}
                >
                  <HiOutlineShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                  {!isEmpty && (
                    <span className="ml-auto inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
    </header>
  );
};

export default Navbar;
