# Current Feature

## Status
In Progress

## Goals

Codebase cleanup — fix low-risk issues found during audit.

### 1. Fix data leak in `getSystemItemTypes`
- **File:** `src/lib/db/items.ts`
- When `userId` is null, the item count query currently spans ALL users instead of returning empty. Add an early return guard (same pattern as every other function in the file).

### 2. Remove redundant `getDemoUserId()` calls — accept `userId` as a parameter
- **Files:** `src/lib/db/collections.ts`, `src/lib/db/items.ts`, `src/app/dashboard/page.tsx`, `src/app/dashboard/layout.tsx`
- Currently every data function independently calls `getDemoUserId()`, resulting in 6 redundant DB lookups per page load.
- Refactor all data functions to accept a `userId: string` parameter instead.
- Export a single `getDemoUserId()` from a shared location (e.g. `src/lib/db/user.ts`) and call it once in the dashboard layout and page, then pass the resolved ID into each function.
- This also prepares the codebase for real auth — just swap the demo lookup for `session.user.id`.
- **Note:** Do not add authentication. The demo user lookup is fine for now, just centralize it.

### 3. Add `DATABASE_URL` validation guard in `prisma.ts`
- **File:** `src/lib/prisma.ts`
- Replace `process.env.DATABASE_URL!` with a proper null check that throws a clear error message.

### 4. Fix `TYPE_ORDER` to match actual seed type names
- **File:** `src/lib/db/items.ts`
- `TYPE_ORDER` uses `"Snippets"`, `"Prompts"`, etc. but seed data uses `"snippet"`, `"prompt"`, etc. The sort currently has no effect. Update to match the actual names.

### 5. Delete dead `mock-data.ts`
- **File:** `src/lib/mock-data.ts`
- 214 lines of unused mock data. No source files import it (only old spec docs reference it). Safe to delete.

### 6. Extract shared `iconMap` to a single file
- **Files:** `src/components/dashboard/Sidebar.tsx`, `src/components/dashboard/CollectionCard.tsx`, `src/components/dashboard/ItemCard.tsx`
- The same `iconMap` object is duplicated in all three files. Extract to `src/lib/icon-map.ts` and import from there.

### 7. Remove password hash log from test script
- **File:** `scripts/test-db.ts`
- Remove the line that logs a partial password hash. The test script only needs to verify connectivity.

## Notes

- These are all low-risk, quick-win fixes identified during a codebase audit.
- No new features or architectural changes.
- Authentication is NOT being added — just centralizing the demo user lookup so it's called once and passed through.

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
