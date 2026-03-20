# GroundVault — Coding Standards

## Code Style & Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`, `canUpload`).
- Structure files in this order: exported component, subcomponents, helpers, static content, types.

---

## Naming Conventions

- **Directories:** lowercase with dashes (e.g., `components/auth-wizard`, `app/api/items`).
- **Components:** named exports, PascalCase filenames (e.g., `ItemCard.tsx`).
- **Utilities / Hooks:** camelCase filenames (e.g., `useCollections.ts`, `formatDate.ts`).

---

## TypeScript

- Strict mode enabled
- Do not use `any` types; use proper typing or `unknown`
- Use type inference where obvious, explicit types where helpful

## React

-  Use functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused - one job per component
- Extract reusable logic into custom hooks

---

## Syntax & Formatting

- Use the `function` keyword for pure, top-level functions. Arrow functions are fine for inline callbacks and component definitions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

```ts
// ✓ Concise conditional
if (!session) redirect("/login");

// ✗ Avoid
if (!session) {
  redirect("/login");
}
```

---

## UI & Styling

- Use **shadcn/ui** (built on Radix UI primitives) and **Tailwind CSS v4** for all components and styling.
- Implement responsive design with Tailwind CSS using a **desktop-first** approach, progressively adapting for smaller screens.
- Follow the project's dark-mode-default convention; ensure all custom styles respect the active theme.

---

## Performance Optimization

- Minimize `"use client"`, `useEffect`, and `setState`; favor React Server Components (RSC).
- Wrap client components in `<Suspense>` with a loading skeleton fallback.
- Use `next/dynamic` for non-critical components.
- Optimize images: use WebP format, include explicit width/height, and implement lazy loading via `next/image`.

---

## Data Fetching & Server Components

- Fetch data in Server Components using Prisma directly; avoid client-side data fetching where possible.
- Use Next.js API routes (`app/api/`) only for mutations, file uploads (Cloudflare R2), AI calls (OpenAI), and webhook handlers (Stripe, NextAuth).
- Colocate data-fetching logic close to where it's used.

```ts
// ✓ Server Component — fetch with Prisma directly
export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { userId: session.user.id },
    include: { items: true },
  });

  return <CollectionGrid collections={collections} />;
}
```

---

## Authentication

- Use **NextAuth** for all auth flows.
- Protect server-side routes and API routes by validating the session early and returning/redirecting on failure.
- Email verification is handled via **Resend**.

---

## Database & ORM (Prisma + Neon)

- Use **Prisma ORM** for all database access. Do not write raw SQL unless absolutely necessary.
- Keep the Prisma schema (`prisma/schema.prisma`) as the single source of truth for the data model.
- Use `cuid()` for all primary keys.
- Add `@@index` directives for any column used in `where` clauses or foreign key lookups.

---

## File Storage (Cloudflare R2)

- All file and image uploads go through a Next.js API route that streams to **Cloudflare R2**.
- Store the resulting R2 URL in `Item.fileUrl`; store the original filename in `Item.fileName` and byte size in `Item.fileSize`.
- File uploads are a Pro-tier feature; enforce the tier check in the API route before uploading.

---

## AI Integration (OpenAI)

- All AI calls (auto-tagging, code explanation, prompt optimizer) route through Next.js API routes — never expose API keys to the client.
- Use **OpenAI GPT-5-nano** as the model.
- AI features are Pro-tier only; enforce the tier check before making API calls.

---

## Client Component Guidelines

Limit `"use client"` to the smallest possible component boundary:

- **Use for:** interactive UI (drawers, modals, toasts), browser API access, event handlers.
- **Avoid for:** data fetching, state that can live on the server, layout components.

```
// ✓ Good — thin client wrapper
"use client";
export function FavoriteButton({ itemId }: { itemId: string }) { ... }

// ✗ Bad — entire page as client component
"use client";
export default function ItemsPage() { ... }
```

---

## Key Conventions Summary

- Optimize Web Vitals (LCP, CLS, INP).
- Use loading skeletons and `<Suspense>` boundaries for perceived performance.
- Use toast notifications (via shadcn/ui) for user action feedback.
- Follow the [Next.js documentation](https://nextjs.org/docs) for data fetching, rendering, and routing patterns.
