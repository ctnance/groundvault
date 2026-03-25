# Current Feature — Auth Credentials (Email/Password)

## Status
In Progress

## Goals

- Add Credentials provider for email/password authentication
- Add password field to User model via migration (if not already there)
- Update `auth.config.ts` with Credentials provider placeholder (`authorize: () => null`)
- Update `auth.ts` to override Credentials with bcrypt validation
- Create registration API route at `POST /api/auth/register` (name, email, password, confirmPassword)
- Verify GitHub OAuth still works after changes

## Notes

- Use bcryptjs for hashing (already installed)
- Split pattern: `auth.config.ts` gets placeholder, `auth.ts` gets real bcrypt logic
- Registration validates passwords match, checks for existing user, hashes password, creates user
- Test via curl and `/api/auth/signin` default page

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
- 2026-03-24: Auth Phase 1 — NextAuth v5 with GitHub OAuth, Prisma adapter, JWT strategy, split config for edge compatibility, proxy-based /dashboard route protection, session type extension
