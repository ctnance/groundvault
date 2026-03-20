GroundVault — Project Overview
> **A unified developer vault for code snippets, commands, notes, links, files, and templates — powered by AI.**
Name is tentative and may change.
---
1. Problem
Developers typically have notes, code snippets, terminal commands, bookmarks, and files scattered across directories, repos, and apps. GroundVault consolidates everything into a single, organized location with AI-powered features to boost productivity.
---
2. Target Users
Audience	Use Case
Developers / Programmers	Store snippets, commands, config files, boilerplate
Content Creators / Educators	Organize reference materials, prompts, templates
Project Managers	Centralize project notes, links, resources
---
3. Core Concepts
Items
Items are the atomic unit of storage. Each item has a type that determines its color and icon for instant visual identification.
Type	Icon	Purpose
Code Snippet	`Code`	Reusable code with syntax highlighting
Note	`StickyNote`	Free-form text notes
Command	`Terminal`	Shell/terminal commands
File	`File`	Uploaded files and images
AI Prompt	`Sparkles`	Prompt templates and AI content
Collections
Collections group related items together (e.g., "React Hooks", "Prototype Prompts", "Context Files"). Items can belong to multiple collections via a many-to-many relationship.
Tags
Lightweight labels for cross-cutting categorization and search filtering.
---
4. Data Model
Entity Relationship Diagram
```
┌──────────┐       ┌──────────────┐       ┌──────────────┐
│   User   │──1:N──│     Item     │──N:M──│  Collection  │
└──────────┘       └──────────────┘       └──────────────┘
                     │                        │
                     │ N:1                    │ N:1
                     ▼                        ▼
                   ┌──────────────┐        ┌──────────┐
                   │   ItemType   │        │   User   │
                   └──────────────┘        └──────────┘
                     │
                     │ N:M
                     ▼
                   ┌──────────────┐
                   │     Tag      │
                   └──────────────┘

  Join Table: ItemCollection (itemId, collectionId, addedAt)
```
Prisma Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // Neon PostgreSQL
}

// ─── User ───────────────────────────────────────────────

model User {
  id                    String    @id @default(cuid())
  name                  String?
  email                 String    @unique
  emailVerified         DateTime?
  image                 String?
  stripeUserId          String?   @unique
  stripeSubscriptionId  String?   @unique

  items       Item[]
  itemTypes   ItemType[]
  collections Collection[]
  accounts    Account[]
  sessions    Session[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── NextAuth Models ────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Item ───────────────────────────────────────────────

model Item {
  id          String      @id @default(cuid())
  title       String
  contentType ContentType @default(TEXT)
  content     String?     // Text content (null if file)
  fileUrl     String?     // Cloudflare R2 URL (null if text)
  fileName    String?     // Original filename (null if text)
  fileSize    Int?        // Bytes (null if text)
  url         String?     // For link/bookmark types
  description String?
  isFavorite  Boolean     @default(false)
  isPinned    Boolean     @default(false)
  language    String?     // Programming language (code snippets)

  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  itemTypeId String
  itemType   ItemType @relation(fields: [itemTypeId], references: [id])

  tags        Tag[]
  collections ItemCollection[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([itemTypeId])
}

enum ContentType {
  TEXT
  FILE
}

// ─── ItemType ───────────────────────────────────────────

model ItemType {
  id       String  @id @default(cuid())
  name     String  // e.g., "Code Snippet", "Note", "Command"
  icon     String  // Lucide icon name
  color    String  // Hex color code
  isSystem Boolean @default(false)

  userId String? // null = system type; set = user-created custom type
  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items Item[]

  @@index([userId])
}

// ─── Collection ─────────────────────────────────────────

model Collection {
  id            String  @id @default(cuid())
  name          String  // e.g., "React Hooks", "Context Files"
  description   String?
  isFavorite    Boolean @default(false)
  defaultTypeId String? // Default ItemType for new empty collections

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items ItemCollection[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

// ─── ItemCollection (Join Table) ────────────────────────

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

// ─── Tag ────────────────────────────────────────────────

model Tag {
  id   String @id @default(cuid())
  name String @unique

  items Item[]
}
```

Never use `prisma db push` or directly update the database structure. Always create migrations that run in development first, then production.
---
5. Tech Stack
Core
Layer	Technology
Framework	Next.js 16 / React 19
Language	TypeScript
Rendering	SSR pages with dynamic client components
API	Next.js API routes (items, file uploads, AI calls)
Deployment	Vercel (continuous deployment)
Data & Storage
Service	Purpose
Neon PostgreSQL	Primary database
Prisma ORM	Database access & migrations
Cloudflare R2	File & image storage
Upstash Redis	Rate limiting, caching (optional)
Auth & Email
Service	Purpose
NextAuth	Authentication
Resend	Email verification
UI
Tool	Purpose
Tailwind CSS v4	Utility-first styling
shadcn/ui	Component library
AI
Service	Purpose
OpenAI GPT-5-nano	Auto-tagging, code explanation, prompt optimization
> **Architecture note:** Single codebase / monorepo deployed on Vercel.
---
6. Monetization
Tier Comparison
Feature	Free	Pro ($8/mo · $72/yr)
Items	50	Unlimited
Collections	3	Unlimited
Item types	All system types (except file/image)	All system + custom types
Search	Basic	Basic
File & image uploads	✗	✓
AI auto-tagging	✗	✓
AI code explanation	✗	✓
AI prompt optimizer	✗	✓
Data export (JSON/ZIP)	✗	✓
Priority support	✗	✓
> **Development note:** Stripe integration will be scaffolded early via `stripeUserId` and `stripeSubscriptionId` on the User model. During development, all users have full access to Pro features. Enforcement will be toggled on before launch.
---
7. UI / UX
Design Principles
Modern & minimal — developer-focused aesthetic
Dark mode default, light mode optional
Clean typography, generous whitespace, subtle borders and shadows
Syntax highlighting for all code blocks
Design reference: Notion
Layout
```
┌─────────────────────────────────────────────────────────┐
│  GroundVault                                    [user]  │
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  SIDEBAR   │  MAIN CONTENT                              │
│            │                                            │
│  Item      │  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  Types     │  │Collection│ │Collection│ │Collection│   │
│  ─ Code    │  │  card    │ │  card    │ │  card    │   │
│  ─ Notes   │  │ (bg clr) │ │ (bg clr) │ │ (bg clr) │   │
│  ─ Cmds    │  └──────────┘ └──────────┘ └──────────┘   │
│  ─ Files   │                                            │
│  ─ AI      │  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│            │  │  Item    │ │  Item    │ │  Item    │   │
│  Latest    │  │  card    │ │  card    │ │  card    │   │
│  Collectns │  │(bdr clr) │ │(bdr clr) │ │(bdr clr) │   │
│            │  └──────────┘ └──────────┘ └──────────┘   │
│            │                                            │
└────────────┴────────────────────────────────────────────┘
```
Sidebar: Item types (links to filtered views), latest collections
Main area: Grid of color-coded collection cards (background color derived from dominant item type) and item cards (border color by type)
Item detail: Opens in a slide-out drawer for quick access
Responsive: Desktop-first; sidebar collapses to a drawer on mobile
Interactions
Smooth transitions and animations
Hover states on all cards
Toast notifications for user actions
Loading skeletons while data fetches
Icons (Lucide)
Type	Icon Name
Code Snippet	`Code`
Note	`StickyNote`
Command	`Terminal`
File	`File`
AI Prompt	`Sparkles`
> Specific hex color codes for each type TBD.
---
8. AI Features (Pro)
Feature	Description
Auto-tagging	Automatically suggests tags when an item is created or updated
Code Explanation	Generates a plain-English summary of any code snippet
Prompt Optimizer	Rewrites and improves AI prompts for clarity and effectiveness
All AI calls route through Next.js API routes → OpenAI GPT-5-nano.
---
9. Documents & Context
Project documentation and AI-assistance context files will be maintained alongside development to keep feature scope and implementation details aligned.