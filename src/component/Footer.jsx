/*
 * Copyright (C) 2025 Dimitrios S. Sfyris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { APP_COPYRIGHT_HOLDER, SHOW_POWERED_BY, POWERED_BY_TEXT } from "../lib/config";

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
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} {APP_COPYRIGHT_HOLDER}
          </p>

          <nav className="flex flex-wrap items-center gap-4 text-sm" aria-label="Footer">
            {footerLinks.map((link) => {
              const active = isRouteActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "text-primary font-medium"
                      : "text-neutral-600 hover:text-ink transition-colors"
                  }
                >
                  {link.name}
                </Link>
              );
            })}
            {SHOW_POWERED_BY && (
              <span className="text-neutral-500">• {POWERED_BY_TEXT}</span>
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
