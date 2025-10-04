# AspectReact Store

![CI](https://github.com/dmsfiris/aspectreact-store/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Router](https://img.shields.io/badge/React%20Router-v6-CA4245?logo=reactrouter&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-Optional-EB5424?logo=auth0&logoColor=white)
![Build](https://img.shields.io/badge/build-CRA%205-blue)
![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL--3.0--or--later-blue)

A clean, modern **React e‑shop UI** that showcases routing, cart & checkout, and pluggable authentication. Built with **React 18**, **React Router v6**, and **Tailwind CSS 3**, with first‑class developer ergonomics (ESLint, Husky, SPDX headers) and a **GitHub Actions** pipeline.

> **Demo status:** This is a front‑end demo (no real payments). Cart & checkout are client‑side. Auth can be **local**, **API-backed**, or **Auth0**.

---

## Table of Contents

- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Authentication Modes](#authentication-modes)
- [Application Flows](#application-flows)
- [SEO & 404](#seo--404)
- [Accessibility & UX](#accessibility--ux)
- [Scripts](#scripts)
- [Testing](#testing)
- [CI](#ci)
- [Deployment](#deployment)
- [Performance Notes](#performance-notes)
- [Troubleshooting](#troubleshooting)
- [Branding & Credits](#branding--credits)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Highlights

- **Modern, accessible UI** — Tailwind CSS, semantic markup, focus states, keyboard‑friendly controls.
- **Product catalog** with **search**, **category filters**, and **sorting** (featured, price ↑/↓, rating ↓).
- **Client‑side cart** — quantity controls, remove/empty, locale‑aware currency formatting via `Intl.NumberFormat`.
- **Checkout flow (demo)** — validated form, order summary, and “thank you”/exit page.
- **Auth (pluggable)** — `local`, `api`, `auth0`. Includes protected routes & **guest→user cart merge** on login.
- **Toasts** on key actions via `react-hot-toast`.
- **Config via env** — brand, locale, currency, support email, and auth mode.
- **DX** — ESLint (React, hooks, a11y, import), Husky pre‑commit, fork‑aware SPDX header tool.
- **CI** — headers check → lint → tests → build artifact.
- **Scroll restoration** — custom `ScrollToTop` so route changes reset to the top.

---

## Tech Stack

- React 18, React Router v6  
- Tailwind CSS 3 (+ forms/typography)  
- Headless UI patterns, Heroicons / react‑icons  
- `react-use-cart`, `react-hot-toast`  
- Optional Auth0 (`@auth0/auth0-react`)  
- Create React App (`react-scripts` 5)  
- ESLint (react, hooks, a11y, import), Husky

---

## Project Structure

```text
src/
  component/
    About.jsx, AuthSection.jsx, Cart.jsx, Checkout.jsx, Contact.jsx,
    Exit.jsx, ForgotPassword.jsx, Home.jsx, Login.jsx, Navbar.jsx,
    NotFound.jsx, Product.jsx, ProtectedPage.jsx, Signup.jsx
  data/
    prodData.js
  lib/
    auth.js        # auth modes + hooks + guards
    config.js      # env-driven config (incl. SUPPORT_EMAIL)
    format.js      # currency helpers
  index.css
  index.js
  App.js
public/
  index.html
tools/
  copyright-headers.mjs   # SPDX header tool (fork-aware, preserves upstream)
```

---

## Routes

| Path               | Purpose                                                                 |
|--------------------|-------------------------------------------------------------------------|
| `/`                | Home page with highlights/featured products                             |
| `/product`         | Product catalog (search • category filters • sorting)                   |
| `/about`           | About the store/brand                                                   |
| `/contact`         | Contact form                                                            |
| `/cart`            | Shopping cart (add/remove, change quantity, totals)                     |
| `/login`           | Sign in (only in `local` / `api` modes)                                 |
| `/signup`          | Create account (only in `local` / `api` modes)                          |
| `/forgot-password` | Request password reset (only in `local` / `api` modes)                  |
| `/checkout`        | Demo checkout form & order summary (protected)                          |
| `/exit`            | Order success / “thank you” page (protected)                            |
| `/protected`       | Example page visible only to authenticated users (guarded)              |
| `/authSection`     | Auth entry/controls area (login/signup/profile quick actions)           |
| `*`                | 404 Not Found (soft 404 with `noindex`, helpful CTAs)                   |

---

## Getting Started

**Prerequisites:** Node 18+ and npm.

```bash
# 1) Install
npm install

# 2) Run dev server (http://localhost:3000)
npm start

# 3) Lint (auto-fix with --fix)
npm run lint
npm run lint -- --fix

# 4) Tests
npm test               # watch mode
npm run test:ci        # CI-friendly, single run

# 5) Build for production
npm run build
```

---

## Configuration

Create `.env.local` from `.env.example`. Only variables prefixed with **`REACT_APP_`** are exposed to the browser (CRA rule).

| Variable                      | Example / Values             | Notes |
|------------------------------|------------------------------|-------|
| `REACT_APP_APP_NAME`         | `AspectReact Store`          | Branding / document title |
| `REACT_APP_DEFAULT_LOCALE`   | `en-US`                      | Locale for formatters |
| `REACT_APP_CURRENCY`         | `USD`                        | ISO code |
| `REACT_APP_ENABLE_TOASTS`    | `true`                       | Feature flag |
| `REACT_APP_AUTH_MODE`        | `local` \| `api` \| `auth0`  | Selects auth implementation (default: `local`) |
| `REACT_APP_API_BASE_URL`     | `http://localhost:4000`      | Used in `api` mode |
| `REACT_APP_AUTH0_DOMAIN`     | `your-tenant.us.auth0.com`   | Used in `auth0` mode |
| `REACT_APP_AUTH0_CLIENT_ID`  | `xxxxxxxx`                   | Used in `auth0` mode |
| `REACT_APP_SUPPORT_EMAIL`    | `support@yourdomain.com`     | Used by 404 “report a problem” link |

**Local dev (Node-only, not bundled):** `PORT`, `HTTPS`, `HOST`, `PUBLIC_URL`.  
**SPDX headers tool (Node-only):** `COPYRIGHT_OWNER`, `COPYRIGHT_START`, `SPDX_ID` (see `.env.example`).

---

## Authentication Modes

- **`local`** — demo‑only user in `localStorage` (signup/login/logout/reset). _Do not use in production._  
- **`api`** — your backend via `REACT_APP_API_BASE_URL`:
  - `POST /auth/signup` → `{ token, user, expiresIn? }`
  - `POST /auth/login` → `{ token, user, expiresIn? }`
  - `POST /auth/logout`
  - `POST /auth/refresh` → `{ token, user?, expiresIn? }` (cookie-based)
  - `POST /auth/reset-password`
  - Includes single‑flight token refresh & optional CSRF header scaffold.
- **`auth0`** — Hosted Universal Login via `@auth0/auth0-react`:
  - Wraps `<App />` with `<Auth0Provider>` only when creds are set.
  - Redirect callback preserves intended route.
  - Reset password deep‑links to Auth0’s hosted page.

---

## Application Flows

### Browsing & Catalog
- Landing page highlights and quick paths to the catalog.  
- Catalog supports **search**, **category filters**, **sorting** (featured, price, rating).

### Cart
- Add/update/remove items; empty cart; totals reflect currency/locale.  
- **Guest→User cart merge:** when a guest with items logs in, their cart is merged into the user cart (with a toast).

### Checkout (Demo)
- Validated contact & shipping form, order summary, submit button disabled until valid.  
- On submit, simulates processing and navigates to `/exit`.

### Protected Content
- `<RequireAuth redirectTo="/login">` wraps protected routes.  
- `<IfAuthenticated />` and `<IfAnonymous />` provide conditional rendering helpers.

---

## SEO & 404

Unknown routes render a polished **NotFound** page that:
- Sets `<title>`, meta description, and `robots: noindex,follow`.
- Shows CTAs for “Back”, “Home”, “Browse products”, and “Contact”.
- Uses `REACT_APP_SUPPORT_EMAIL` for a mailto “report a broken link”.

For best SEO on a real host, serve a **true 404 status** while rendering this page (server/CDN rule), and still use the client‑side NotFound for SPA UX.

---

## Accessibility & UX

- Focus‑visible styles, descriptive labels, `aria-*` on form controls.  
- Keyboard‑friendly navigation and controls.  
- Headless‑style patterns for menus/sheets/modals.  
- **Scroll restoration** via `ScrollToTop` so each route change starts at the top.

---

## Scripts

```jsonc
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "test:ci": "react-scripts test --watchAll=false",
  "eject": "react-scripts eject",
  "lint": "eslint .",
  "lint:fix": "npm run lint -- --fix",
  "headers:check": "node tools/copyright-headers.mjs --check",
  "headers:apply": "node tools/copyright-headers.mjs",
  "prepare": "husky install"
}
```
> ESLint is configured for React, hooks, a11y, and imports. On Windows, if shell globs cause issues, use:  
`eslint . --ext .js,.jsx`

---

## Testing

- Jest + **React Testing Library** + **jest‑dom** are configured.  
- Global setup: `src/setupTests.js`.  
- Place tests under `src/**/__tests__` or alongside components (e.g., `Component.test.jsx`).

```bash
npm test         # watch
npm run test:ci  # single run (used in CI)
```

---

## CI

Workflow: `.github/workflows/ci.yml`

Pipeline stages:
1. Headers check (SPDX) — dry run; fails CI if any missing/outdated.  
2. ESLint — fails on errors.  
3. Tests — `npm run test:ci`.  
4. Build — CRA production build, uploaded as an artifact.

Set repo variables/secrets as needed:
- `REACT_APP_SUPPORT_EMAIL` (Actions → Variables)
- `REACT_APP_AUTH0_DOMAIN` / `REACT_APP_AUTH0_CLIENT_ID` (Actions → Secrets)

Badge:

```md
![CI](https://github.com/dmsfiris/aspectreact-store/actions/workflows/ci.yml/badge.svg)
```

---

## Deployment

```bash
npm run build
```
- Publish the `build/` directory on any static host.  
- **SPA fallback**: configure your host/CDN to serve `index.html` for unknown paths. Keep the client‑side 404 for UX/SEO.

---

## Performance Notes

- Minimal client state; cart via `react-use-cart`; product data is static for the demo.  
- Centralized currency formatting.  
- Lazy‑loaded images in catalog views.

---

## Troubleshooting

- **Module not found on CI (Linux)** → imports are *case‑sensitive*. Ensure paths match filenames exactly.  
- **CRA treats warnings as errors** (`CI=true`) → fix lint warnings locally; keep the dedicated lint step as source of truth.  
- **Auth0 issues** → check Allowed Callback/Logout URLs and env vars.  
- **No tests found in CI** → ensure at least one test exists or use `test:ci` (already configured).  
- **Headers in JSON/MD** → the header tool intentionally skips `.md`; JSON is also skipped in apply mode by default.

---

## Branding & Credits

- This template includes a small footer credit in the UI. You may adapt or remove it for your deployment.  
- For naming, logos, and credit patterns, see **[BRANDING.md](./BRANDING.md)**.

---

## Roadmap

- Product API & image assets  
- Stripe Checkout & order emails  
- Account area (orders, addresses)  
- i18n & RTL  
- E2E tests (Playwright/Cypress)

---

## License

This project is licensed under the **GNU General Public License v3.0 or later (GPL-3.0-or-later)**.

**You may:** use, study, modify, and redistribute this software (commercially or not).  
**You must (when you distribute software):**
- Share the complete, corresponding **source code** for anything you distribute to others (e.g., packaged apps).  
- License your **modifications and derivative works** under GPL‑3.0‑or‑later as well.  
- Include a copy of this license and retain copyright & SPDX notices.

**Third‑party components** remain under their own licenses. When redistributing, include third‑party licenses as required.  
See [`LICENSE`](./LICENSE) for the full license text.

---

## Acknowledgements

- [React](https://react.dev) • [React Router](https://reactrouter.com) • [Tailwind CSS](https://tailwindcss.com)  
- [react-use-cart](https://github.com/notrab/react-use-cart) • [react-hot-toast](https://react-hot-toast.com)  
- Testing: [React Testing Library](https://testing-library.com/) + [jest-dom](https://github.com/testing-library/jest-dom)
