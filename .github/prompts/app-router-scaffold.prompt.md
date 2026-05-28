---
description: "Scaffold a new Next.js App Router route in frontend/app with minimal page, optional layout/loading/error, and correct server/client boundaries."
name: "App Router Scaffold"
argument-hint: "route path under app/ (e.g., dashboard, (auth)/login, users/[id]) + options (layout, loading, error, client)"
agent: "agent"
---

Create a new App Router route scaffold under frontend/app.

Requirements

- Follow Next.js App Router rules in [.github/instructions/nextjs-app-router.instructions.md](.github/instructions/nextjs-app-router.instructions.md).
- Follow Tailwind v4 conventions in [.github/instructions/tailwind-v4.instructions.md](.github/instructions/tailwind-v4.instructions.md).
- Keep the scaffold minimal and production-focused. Do not add demo/example content unless explicitly requested.

Inputs to confirm (ask if missing)

- Route path under app/ (supports groups like (auth)/login and params like users/[id]).
- Which files to include: layout.tsx, loading.tsx, error.tsx.
- Should the page be Server or Client? If Client, decide whether to extract a separate client component.
- Any required UI elements or data fetching needs.

Scaffold rules

- Create only the requested files; default to page.tsx only if no options are provided.
- error.tsx must be a Client Component with the correct error boundary signature.
- Use minimal Tailwind classes and existing tokens (font-sans, color vars) when styling is required.
- Avoid next/dynamic with { ssr: false } in Server Components.

Output

- Create or update files in frontend/app to match the route path.
- Summarize created files and note any decisions or assumptions.
