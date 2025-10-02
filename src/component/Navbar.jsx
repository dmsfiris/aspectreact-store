import React from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useCart } from "react-use-cart";
import { Link } from "react-router-dom";

import AuthSection from "./AuthSection";
import eCom from "../assets/eCom.png";
import { APP_NAME } from "../lib/config";

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

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-3">
                  <Link to="/" className="flex items-center gap-2">
                    <img
                      src={eCom}
                      alt={`${APP_NAME} brand logo`}
                      className="h-8 w-8"
                      loading="eager"
                    />
                    <span className="font-display text-xl tracking-tight text-ink">
                      {APP_NAME}
                    </span>
                  </Link>
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-sm text-neutral-600 hover:text-ink px-2 py-1 rounded-lg transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Right side: Cart + Auth + Mobile menu */}
                <div className="flex items-center gap-2">
                  <Link
                    to="/cart"
                    className="relative rounded-xl border border-neutral-200 px-3 py-2 hover:shadow-card transition"
                    aria-label="Open cart"
                  >
                    <HiOutlineShoppingCart className="h-5 w-5 text-neutral-700" />
                    {!isEmpty && (
                      <span className="absolute -top-1 -right-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-primary text-white text-xs px-1">
                        {totalItems}
                      </span>
                    )}
                  </Link>

                  <AuthSection />

                  <div className="md:hidden">
                    <Disclosure.Button className="ml-1 inline-flex items-center justify-center rounded-xl border border-neutral-200 p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <span className="sr-only">Open main menu</span>
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
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      "block rounded-lg px-3 py-2 text-base font-medium",
                      "text-neutral-700 hover:bg-neutral-100 hover:text-ink"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/cart"
                  className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-ink"
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
