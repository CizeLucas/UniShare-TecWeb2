---
description: "Best practices for building Next.js (App Router) apps with modern caching, tooling, and server/client boundaries (aligned with Next.js 16.1.1)."
applyTo: "**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.css"
---

# Next.js App Router best practices

- Scope: frontend/ (Next.js 16.2.6). For backend NestJS, follow [.github/instructions/nestjs-best-practices.instructions.md](.github/instructions/nestjs-best-practices.instructions.md). For local Next.js docs and breaking changes, see [frontend/AGENTS.md](frontend/AGENTS.md).
- Commands: use scripts in [frontend/package.json](frontend/package.json) and [frontend/README.md](frontend/README.md).

## Server and client boundaries

- Default to Server Components; add 'use client' only for state, effects, browser APIs, or client-only libs.
- Never use next/dynamic with { ssr: false } inside a Server Component. Move client-only UI into a Client Component and import it directly.
- When composing multiple client-only elements, wrap them in a single Client Component to keep boundaries clear.

## Request-bound APIs are async

- Treat cookies(), headers(), and draftMode() as async in the App Router.
- params and searchParams may be Promises; await before use.
- Accessing request data makes a route dynamic; do it intentionally and isolate dynamic parts behind Suspense when mixing static and dynamic UI.

## Routing and data boundaries

- Use app/ routes and layouts; use (group) for route groups and \_private for non-routed folders.
- Route handlers live in app/api/\*\*/route.ts and export GET, POST, etc. Validate input (zod or yup) and return correct status codes.
- Do not call your own route handlers from Server Components to reuse logic. Extract shared logic into lib/ and call it directly.

## Caching and revalidation (Next 16 Cache Components)

- Prefer Cache Components with cacheComponents: true in [frontend/next.config.ts](frontend/next.config.ts) and the use cache directive.
- Tag cached results with cacheTag and control lifetimes with cacheLife.
- Prefer revalidateTag(tag, 'max') for stale-while-revalidate; use updateTag in Server Actions for read-your-writes.
- Avoid unstable_cache in new code.

## Tooling and config

- Turbopack config lives under the top-level turbopack key in [frontend/next.config.ts](frontend/next.config.ts). Do not use experimental.turbo.
- ESLint should run via npm run lint (eslint CLI). Avoid next lint.
- Typed routes are stable via typedRoutes when needed (TypeScript required).

## Environment and hygiene

- Use .env.local for secrets. NEXT*PUBLIC*\* variables are build-time only.
- Do not add example or demo files unless explicitly requested.
- Prefer next/image and next/font for assets and fonts when possible.
