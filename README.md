> Copyright (C) 2025 Dimitrios S. Sfyris — SPDX-License-Identifier: GPL-3.0-or-later

# AspectReact Store

AspectReact Store — a clean, modern React e-shop UI built with React Router and Tailwind.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Router](https://img.shields.io/badge/React%20Router-v6-CA4245?logo=reactrouter&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-Optional-EB5424?logo=auth0&logoColor=white)
![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue)
![Build](https://img.shields.io/badge/build-CRA%205-blue)

> **Demo status:** This is a front‑end demo (no real payments). Cart & checkout are client‑side. Auth is optional and can be backed by Auth0.

---

## Table of Contents

- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Application Flows](#application-flows)
  - [Browsing & Catalog](#browsing--catalog)
  - [Cart](#cart)
  - [Checkout (Demo)](#checkout-demo)
  - [Authentication Modes](#authentication-modes)
    - [None](#none)
    - [Local](#local)
    - [API](#api)
    - [Auth0](#auth0)
  - [Protected Content](#protected-content)
- [Accessibility & UX](#accessibility--ux)
- [Scripts](#scripts)
- [Performance Notes](#performance-notes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)

---

## Highlights

- **Modern, accessible UI**: Tailwind CSS, Headless UI patterns, semantic markup, focus states, and keyboard‑friendly controls.
- **Product catalog** with **search**, **category filters**, and **sorting** (featured, price ↑/↓, rating ↓).
- **Client‑side cart** with quantity controls, remove, empty cart, and formatted totals (via `react-use-cart` + `Intl.NumberFormat`).
- **Checkout flow (demo)**: validated form, summary, and a **success/exit** screen.
- **Auth (pluggable)**: local/API prototype modes + **Auth0** integration. Includes a protected route example.
- **Polished navigation**: responsive header with collapsible mobile menu, cart badge, and auth actions.
- **Toasts** for key actions via `react-hot-toast`.
- **Configurable brand, locale & currency** via environment variables.

---

## Tech Stack

- React 18, React Router v6  
- Tailwind CSS 3 (+ forms/typography)  
- Headless UI, Heroicons/react-icons  
- `react-use-cart`, `react-hot-toast`  
- Optional Auth0 (`@auth0/auth0-react`)  
- Create React App (`react-scripts` 5)  
- ESLint configured for React, hooks, a11y, and import resolution

---

## Project Structure (key parts)

```text
src/
  component/
  lib/
  data/
  App.js
  index.js
public/
  index.html
```

---

## Routes

| Path | Purpose |
|---|---|
| `/` | |
| `/product` | |
| `/about` | |
| `/contact` | |
| `/cart` | |
| `/login` | |
| `/signup` | |
| `/forgot-password` | |
| `/checkout` | |
| `/exit` | |
| `/protected` | |
| `/authSection` | |

---

## Getting Started

**Prerequisites:** Node 18+ and npm.

```bash
# 1) Install
npm install

# 2) Run dev server (http://localhost:3000)
npm start

# 3) Lint (fix issues automatically with --fix)
npm run lint
npm run lint -- --fix

# 4) Build for production
npm run build

# 5) Test (when tests are added)
npm test
```

---

## Configuration

Create a `.env` (or `.env.local`) from `.env.example`. Variables exposed to the browser must be prefixed with **`REACT_APP_`**.

| Variable | Example / Values |
|---|---|
| `REACT_APP_APP_NAME` | `"YourAppNameHere"` |
| `REACT_APP_DEFAULT_LOCALE` | `"en-US"` |
| `REACT_APP_CURRENCY` | `"USD"` |
| `REACT_APP_ENABLE_TOASTS` | `true` |
| `REACT_APP_AUTH_MODE` | `"local"` |
| `REACT_APP_API_BASE_URL` | `"http://localhost:4000"` |
| `REACT_APP_AUTH0_DOMAIN` | `"your-tenant.us.auth0.com"` |
| `REACT_APP_AUTH0_CLIENT_ID` | `"your-auth0-client-id"` |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | `"pk_test_yourPublishableKeyHere"` |
| `REACT_APP_ANALYTICS_WRITE_KEY` | `"your-analytics-key"` |
| `REACT_APP_ENABLE_ANALYTICS` | `false` |
| `PORT` | `3000` |
| `HTTPS` | `false` |
| `HOST` | `localhost` |

### Auth modes (`REACT_APP_AUTH_MODE`)
- `none` — disable auth UI (pure browsing/cart/checkout demo).
- `local` — demo in‑memory/localStorage auth for prototyping.
- `api` — wire your own backend at `REACT_APP_API_BASE_URL` (token + optional refresh/CSRF scaffold).
- `auth0` — use Auth0 Universal Login. Provide `REACT_APP_AUTH0_DOMAIN` and `REACT_APP_AUTH0_CLIENT_ID`.

> Only variables starting with `REACT_APP_` are injected into the client at build/dev time (Create React App constraint).

---

## Application Flows

### Browsing & Catalog
- Landing page with highlights and calls to action.  
- **Product** grid supports **search**, **category filters**, and **sorting** (featured, price, rating).  
- Accessible controls and lazy‑loaded images for performance.

### Cart
- Add items from product grid or details.  
- Update quantity, remove items, or empty cart entirely.  
- Totals are formatted using the configured `REACT_APP_CURRENCY` & `REACT_APP_DEFAULT_LOCALE`.

### Checkout (Demo)
- Client‑side form validation and order summary.  
- On submit, navigates to **`/exit`** success page.  
- Replace with your payment provider (e.g., Stripe Checkout) for production.

### Authentication Modes

#### None
- No authentication required.  
- Guards will treat all users as anonymous.

#### Local
- **Signup:** creates a mock user in `localStorage` (email/password). _Demo only — do not store plain passwords in real apps._  
- **Login:** matches email/password to the stored user.  
- **Logout:** clears local user.  
- **Reset password:** simulated async flow.

#### API
- Expects backend endpoints (examples):  
  - `POST /auth/signup` → `{ token, user, expiresIn? }`  
  - `POST /auth/login` → `{ token, user, expiresIn? }`  
  - `POST /auth/logout` (cookie or header)  
  - `POST /auth/refresh` → `{ token, user?, expiresIn? }`  
  - `POST /auth/reset-password`  
- **Token handling:** bearer token stored locally.  
- **Silent refresh:** single‑flight refresh promise + scheduled renewals; 401 triggers a single refresh then retries the original request.  
- **CSRF (optional):** helper header included if your backend requires it.

#### Auth0
- **Provider:** `src/index.js` wraps the app with `<Auth0Provider />` only when `REACT_APP_AUTH_MODE=auth0` and credentials are set.  
- **Login/Signup:** uses Auth0 Universal Login (`loginWithRedirect`, `screen_hint: "signup"`).  
- **Logout:** redirects back to `window.location.origin`.  
- **Reset password:** deep‑links to Auth0 hosted reset page using your domain/client ID.  
- **Return to previous page:** `appState.returnTo` is respected by the redirect handler.

### Protected Content
- **Guards:**  
  - `<RequireAuth />` — redirects anonymous users to a route (default `/`).  
  - `<IfAuthenticated />` / `<IfAnonymous />` — conditional rendering.  
- **Implementation:** `useAuth` is selected at module load based on `REACT_APP_AUTH_MODE`, avoiding conditional hook calls.

---

## Accessibility & UX

- Focus-visible styles, labeled controls (`aria-*`, `sr-only`), logical tab order.  
- Headless UI patterns for accessible popovers/menus.  
- Color contrast and spacing tuned via Tailwind tokens.

---

## Scripts

```jsonc
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "lint": "eslint ."
}
```
> ESLint is configured for React, hooks, a11y, and imports. If Windows shell globs cause issues, use:  
`eslint . --ext .js,.jsx`

---

## Performance Notes

- Lean client state: cart via `react-use-cart`; most data is static under `src/data`.  
- Currency formatting centralized (locale-aware).  
- Images marked `loading="lazy"` to improve LCP on catalog pages.

---

## Testing

This template uses Create React App’s test runner (`react-scripts test`). Add React Testing Library/Jest tests under `src/**/__tests__` or alongside components (e.g., `Component.test.jsx`).

---

## Deployment

- **Netlify / Vercel** — set env vars in dashboard, build via `npm run build`, publish `build/`.  
- **GitHub Pages** — set `homepage` in `package.json`, build, and publish `build/`.  
- **Any static host** — serve the contents of `build/` and configure SPA fallback to `index.html`.

---

## Troubleshooting

- **ESLint “no config found”** → add `.eslintrc.json` (see repo) or `npm init @eslint/config`.  
- **`import/no-unresolved` for `.jsx`** → ensure resolver is configured for `[".js",".jsx"]`.  
- **“Hooks called conditionally”** → `useAuth` is selected at module load; avoid calling hooks in conditionals.  
- **Auth0 not working** → verify `REACT_APP_AUTH0_DOMAIN` and `REACT_APP_AUTH0_CLIENT_ID`; check Allowed Callback/Logout URLs.  
- **API 401 loops** → check refresh endpoint and CORS; ensure cookies/headers match your backend’s expectations.

---

## Roadmap

- Real product API & media assets  
- Stripe Checkout & order emails  
- Account area (orders, addresses)  
- i18n + RTL support  
- E2E tests (Playwright/Cypress)

---

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.  
You may copy, modify, and distribute this software under the terms of the GPL-3.0. Any derivative work must also be licensed under GPL-3.0 and include copyright and license notices.

> **Note:** Third‑party dependencies in this project are licensed by their respective authors and may have different terms.

See the `LICENSE` file in this repository for the full text of the license.