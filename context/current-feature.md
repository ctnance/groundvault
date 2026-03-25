# Current Feature: Auth Setup — NextAuth + GitHub Provider

## Status
In Progress

## Goals

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Set up split auth config pattern for edge compatibility
- Add GitHub OAuth provider
- Protect `/dashboard/*` routes using Next.js 16 proxy
- Redirect unauthenticated users to sign-in
- Use NextAuth's default pages for testing

## Notes

- Use `next-auth@beta` (not `@latest` which installs v4)
- Proxy file must be at `src/proxy.ts` (same level as `app/`)
- Use named export: `export const proxy = auth(...)` not default export
- Use `session: { strategy: 'jwt' }` with split config pattern
- Don't set custom `pages.signIn` — use NextAuth's default page
- Files to create: `src/auth.config.ts`, `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/proxy.ts`, `src/types/next-auth.d.ts`
- Env vars needed: `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`
- Use Context7 to verify newest config and conventions

## History

- 2026-03-20: Initial Next.js and Tailwind setup committed and pushed to GitHub
- 2026-03-21: Dashboard UI Phase 1 — shadcn/ui init, dark mode, /dashboard route with top bar, sidebar and main placeholders
- 2026-03-21: Dashboard UI Phase 2 — Collapsible sidebar with item types, collapsible collections (favorites/recent/all subsections), user avatar, mobile drawer via Sheet, added Images and Links types, renamed types to plural
- 2026-03-21: Dashboard UI Phase 3 — Main content area with stats cards, recent collections grid, pinned items, recent items, CollectionCard/ItemCard/StatsCards components, badge and card UI components
- 2026-03-21: Prisma 7 + Neon PostgreSQL — schema with all models (User, Account, Session, VerificationToken, Item, ItemType, Collection, ItemCollection, Tag), initial migration applied, Neon adapter, db test script
- 2026-03-21: Seed script — demo user, 7 system item types, 5 collections with 17 items
- 2026-03-21: Dashboard collections — replaced mock collection data with real Prisma queries, added db/collections.ts data layer, StatsCards accepts props, CollectionCard shows type-based border color and type icons
- 2026-03-22: Dashboard items — replaced mock item data with real Prisma queries, added db/items.ts data layer with getPinnedItems/getRecentItems, updated ItemCard to use ItemWithType from db
- 2026-03-22: Stats & sidebar — replaced mock sidebar data with real Prisma queries, added getSystemItemTypes/getSidebarCollections to db layer, sidebar shows item types with counts and collections with colored circles for recents, added "View all collections" link
- 2026-03-22: Pro badge — added subtle PRO badge (shadcn/ui Badge, secondary variant) next to File and Image types in sidebar, badge prop on NavLink
- 2026-03-22: Codebase cleanup — fixed data leak in getSystemItemTypes, centralized getDemoUserId into db/user.ts, added DATABASE_URL validation guard, fixed TYPE_ORDER to match seed names, deleted dead mock-data.ts, extracted shared iconMap to lib/icon-map.ts, removed password hash log, added default query limits
