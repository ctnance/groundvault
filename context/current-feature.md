# Current Feature

## Status
In Progress

## Goals

- Create `prisma/seed.ts` to populate the database with sample data for development and demos
- Seed a demo user (demo@groundvault.io / 12345678, hashed with bcryptjs 12 rounds)
- Seed 7 system item types: snippet, prompt, command, note, file, image, link (with Lucide icons and hex colors)
- Seed 5 collections with associated items:
  - **React Patterns** — 3 snippets (TypeScript hooks/patterns/utilities)
  - **AI Workflows** — 3 prompts (code review, docs generation, refactoring)
  - **DevOps** — 1 snippet, 1 command, 2 links (real URLs)
  - **Terminal Commands** — 4 commands (git, docker, process, package manager)
  - **Design Resources** — 4 links (real URLs for CSS/Tailwind, component libs, design systems, icons)

## Notes

- See `context/features/seed-spec.md` for full specification

## History

- 2026-03-20: Initial Next.js and Tailwind setup committed and pushed to GitHub
- 2026-03-21: Dashboard UI Phase 1 — shadcn/ui init, dark mode, /dashboard route with top bar, sidebar and main placeholders
- 2026-03-21: Dashboard UI Phase 2 — Collapsible sidebar with item types, collapsible collections (favorites/recent/all subsections), user avatar, mobile drawer via Sheet, added Images and Links types, renamed types to plural
- 2026-03-21: Dashboard UI Phase 3 — Main content area with stats cards, recent collections grid, pinned items, recent items, CollectionCard/ItemCard/StatsCards components, badge and card UI components
- 2026-03-21: Prisma 7 + Neon PostgreSQL — schema with all models (User, Account, Session, VerificationToken, Item, ItemType, Collection, ItemCollection, Tag), initial migration applied, Neon adapter, db test script
