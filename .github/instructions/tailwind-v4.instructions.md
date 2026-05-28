---
description: "Use when: Tailwind CSS v4 styling conventions for the Next.js frontend in this repo."
applyTo:
  - "frontend/**/*.tsx"
  - "frontend/**/*.ts"
  - "frontend/**/*.jsx"
  - "frontend/**/*.js"
  - "frontend/**/*.css"
---

# Tailwind CSS v4 conventions

- Scope: frontend/ only. For Next.js App Router rules, see [.github/instructions/nextjs-app-router.instructions.md](.github/instructions/nextjs-app-router.instructions.md).
- Use Tailwind v4 via PostCSS (see [frontend/postcss.config.mjs](frontend/postcss.config.mjs)); do not add a tailwind.config.js unless explicitly requested.
- Keep the Tailwind entrypoint in [frontend/app/globals.css](frontend/app/globals.css) using @import "tailwindcss".
- Define theme tokens in [frontend/app/globals.css](frontend/app/globals.css) with @theme inline and CSS variables; prefer token utilities like font-sans and color variables over hardcoded values.
- Prefer utility classes in components; extract repeated UI into reusable components instead of large ad-hoc class strings.
- When adding global styles, keep them minimal and align with existing tokens in [frontend/app/globals.css](frontend/app/globals.css).
