# Branding & Attribution Guidelines

These guidelines explain how to present **AspectReact** when you build, deploy, or talk about projects based on this codebase. They’re written to be practical for day‑to‑day use by developers, agencies, and integrators.

> Short version: please credit the project clearly and avoid branding your distribution as “AspectReact” in a way that could confuse people about where it came from.

---

## 1) Names & how to refer to the project

- **Project name:** **AspectReact**  
- **Repository name:** **AspectReact Store** (this particular demo implementation)

Use **“AspectReact”** when you refer to the underlying framework/template. If you ship a tailored product to clients, give it **your own brand name**, and acknowledge that it’s built with AspectReact (see §3).

**Please avoid** naming your product simply “AspectReact” or something that could be mistaken for the original project.

---

## 2) Recommended credits (gentle, familiar pattern)

Consistent credit helps users and other developers find the source project and updates. A familiar, unobtrusive pattern is a small footer line:

```html
<a href="https://github.com/dmsfiris/aspectreact-store" rel="noreferrer" target="_blank">
  Built with AspectReact
</a>
```

If you prefer a badge, here’s a tiny **SVG** you can drop in as-is:

```html
<a href="https://github.com/dmsfiris/aspectreact-store" target="_blank" rel="noreferrer" aria-label="Built with AspectReact">
  <svg xmlns="http://www.w3.org/2000/svg" width="156" height="24" viewBox="0 0 156 24" role="img">
    <rect width="156" height="24" rx="4" fill="#111827"/>
    <text x="12" y="16" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
          font-size="12" fill="#F9FAFB">Built with AspectReact</text>
  </svg>
</a>
```

Or a simple **text link** with minimal Tailwind styling:

```html
<a class="text-neutral-600 hover:text-ink transition-colors"
   href="https://github.com/dmsfiris/aspectreact-store" target="_blank" rel="noreferrer">
  Built with AspectReact
</a>
```

**SPA meta generator (optional):** add a meta tag so analytics and audits can detect the stack:

```html
<meta name="generator" content="AspectReact" />
```

---

## 3) Where to place the credit

Choose one or more locations appropriate for your project:

- **Site footer** (recommended): “Built with AspectReact”  
- **About / Credits** page: short sentence like _“This site is built with AspectReact.”_  
- **Repository docs:** mention in `README` and/or `CHANGELOG`  
- **Marketing materials / case studies:** “Powered by AspectReact” works well

If visual constraints prevent a footer line, keep a mention in your **/about** page and/or repository README.

---

## 4) Using the name alongside your brand

Suggested formats when you ship to clients:

- **YourBrand**, _built with AspectReact_  
- **YourBrand for AspectReact** (if you publish a theme or extension)  
- **YourBrand — based on AspectReact**

Avoid implying official partnership or endorsement. If you contribute upstream or maintain an official integration, feel free to say so in your docs, linking to the relevant pull requests or repositories.

---

## 5) Sample snippets for this repo

This repository already includes an env toggle for a footer credit. If you use the provided config, you can show the credit like this:

```jsx
// Footer.jsx (excerpt)
{SHOW_POWERED_BY && (
  <a
    href="https://github.com/dmsfiris/aspectreact-store"
    target="_blank"
    rel="noreferrer"
    className="transition-colors text-neutral-600 hover:text-ink"
  >
    {POWERED_BY_TEXT /* default: "Built with AspectReact" */}
  </a>
)}
```

And in your environment config:

```env
REACT_APP_SHOW_POWERED_BY=true
REACT_APP_POWERED_BY_TEXT="Built with AspectReact"
```

---

## 6) Logos & visual identity

There’s no official logo package yet. Until one exists, use plain text **AspectReact** with your standard body font. If you design a logo or badge for your deployment, please present it as your own brand element and use the text credit formats above to reference the project.

---

## 7) What’s allowed / encouraged

- Build commercial or non‑commercial projects on top of AspectReact.  
- Rebrand your shipped solution with your own product name.  
- Credit AspectReact prominently so users and developers can find the source.  
- Publish articles, tutorials, or showcases referencing AspectReact—link back to the repo.

## 8) What to avoid

- Branding your product **as if it were** the original “AspectReact”.  
- Suggesting official affiliation or endorsement where none exists.  
- Removing all mention of AspectReact in contexts where a short credit fits naturally (footer, about, README).

---

## 9) License notes (very short)

The code is licensed **GPL‑3.0‑or‑later**. When you redistribute the software (in source or compiled form), keep the license text and copyright notices, and provide the corresponding source to your recipients as required by the GPL. See `LICENSE` for the full terms.

For questions about branding or licensing in specific situations, involve your organization’s legal or compliance team.

---

## 10) Contact

Project repo: <https://github.com/dmsfiris/aspectreact-store>  
Maintainer contact: **dmsfiris@otenet.gr**
