import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// ─── System Item Types ──────────────────────────────────

const systemTypes = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
] as const;

// ─── Helper ─────────────────────────────────────────────

function typeId(name: string, types: Map<string, string>) {
  const id = types.get(name);
  if (!id) throw new Error(`Unknown item type: ${name}`);
  return id;
}

// ─── Main ───────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── 0. Clean existing seed data ───────────────────────

  const existing = await prisma.user.findUnique({
    where: { email: "demo@groundvault.io" },
  });

  if (existing) {
    await prisma.item.deleteMany({ where: { userId: existing.id } });
    await prisma.collection.deleteMany({ where: { userId: existing.id } });
    console.log("✓ Cleared previous seed data");
  }

  // ── 1. Demo User ──────────────────────────────────────

  const hashedPassword = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@groundvault.io" },
    update: { password: hashedPassword, isPro: false },
    create: {
      name: "Demo User",
      email: "demo@groundvault.io",
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`✓ User: ${user.email}`);

  // ── 2. System Item Types ──────────────────────────────

  const typeMap = new Map<string, string>();

  for (const t of systemTypes) {
    const itemType = await prisma.itemType.upsert({
      where: { id: t.name }, // use name as stable id for idempotency
      update: { icon: t.icon, color: t.color },
      create: {
        id: t.name,
        name: t.name,
        icon: t.icon,
        color: t.color,
        isSystem: true,
      },
    });
    typeMap.set(t.name, itemType.id);
  }
  console.log(`✓ Item types: ${systemTypes.length}`);

  // ── 3. Collections & Items ────────────────────────────

  // Helper to create items and link them to a collection
  async function seedCollection(
    name: string,
    description: string,
    items: {
      title: string;
      type: string;
      content?: string;
      language?: string;
      url?: string;
      isFavorite?: boolean;
      isPinned?: boolean;
    }[]
  ) {
    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        userId: user.id,
      },
    });

    for (const item of items) {
      const created = await prisma.item.create({
        data: {
          title: item.title,
          content: item.content ?? null,
          language: item.language ?? null,
          url: item.url ?? null,
          isFavorite: item.isFavorite ?? false,
          isPinned: item.isPinned ?? false,
          userId: user.id,
          itemTypeId: typeId(item.type, typeMap),
          collections: {
            create: { collectionId: collection.id },
          },
        },
      });
      console.log(`  • ${created.title}`);
    }

    console.log(`✓ Collection: ${name} (${items.length} items)`);
    return collection;
  }

  // ── React Patterns ────────────────────────────────────

  await seedCollection("React Patterns", "Reusable React patterns and hooks", [
    {
      title: "useDebounce Hook",
      type: "snippet",
      language: "typescript",
      isPinned: true,
      content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
    },
    {
      title: "Context Provider Pattern",
      type: "snippet",
      language: "typescript",
      content: `import { createContext, useContext, useState, type ReactNode } from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext value={{ theme, toggle }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}`,
    },
    {
      title: "Type-safe Object.keys",
      type: "snippet",
      language: "typescript",
      content: `export function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (groups, item) => {
      const value = String(item[key]);
      (groups[value] ??= []).push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}`,
    },
  ]);

  // ── AI Workflows ──────────────────────────────────────

  await seedCollection("AI Workflows", "AI prompts and workflow automations", [
    {
      title: "Code Review Prompt",
      type: "prompt",
      isFavorite: true,
      content: `Review the following code for:
1. Security vulnerabilities (injection, XSS, auth bypass)
2. Performance issues (N+1 queries, unnecessary re-renders)
3. Error handling gaps
4. Naming and readability improvements

Be concise. List issues as bullet points with severity (critical/warning/info).

Code:
\`\`\`
{{code}}
\`\`\``,
    },
    {
      title: "Documentation Generator",
      type: "prompt",
      content: `Generate concise documentation for the following code. Include:
- A one-line summary
- Parameters and return types
- Usage example
- Edge cases or gotchas

Keep it practical — skip obvious details. Write for a developer who will use this function, not read about it.

Code:
\`\`\`
{{code}}
\`\`\``,
    },
    {
      title: "Refactoring Assistant",
      type: "prompt",
      content: `Analyze this code and suggest refactoring improvements:
- Extract reusable logic into functions or hooks
- Simplify complex conditionals
- Reduce duplication
- Improve type safety

Show the refactored code with brief explanations for each change.

Code:
\`\`\`
{{code}}
\`\`\``,
    },
  ]);

  // ── DevOps ────────────────────────────────────────────

  await seedCollection(
    "DevOps",
    "Infrastructure and deployment resources",
    [
      {
        title: "Multi-stage Dockerfile",
        type: "snippet",
        language: "dockerfile",
        content: `FROM node:22-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        title: "Deploy to Production",
        type: "command",
        content: `git checkout main && git pull origin main && npm run build && npm start`,
      },
      {
        title: "Vercel Documentation",
        type: "link",
        url: "https://vercel.com/docs",
        content: "Official Vercel deployment and platform documentation.",
      },
      {
        title: "GitHub Actions Docs",
        type: "link",
        url: "https://docs.github.com/en/actions",
        content:
          "CI/CD workflows, reusable actions, and automation documentation.",
      },
    ]
  );

  // ── Terminal Commands ─────────────────────────────────

  await seedCollection(
    "Terminal Commands",
    "Useful shell commands for everyday development",
    [
      {
        title: "Interactive Rebase — Last N Commits",
        type: "command",
        isPinned: true,
        content: `git rebase -i HEAD~3`,
      },
      {
        title: "Docker — Remove Dangling Images",
        type: "command",
        content: `docker image prune -f && docker system df`,
      },
      {
        title: "Kill Process on Port",
        type: "command",
        content: `lsof -ti:3000 | xargs kill -9`,
      },
      {
        title: "List Outdated Packages",
        type: "command",
        content: `npm outdated --long`,
      },
    ]
  );

  // ── Design Resources ──────────────────────────────────

  await seedCollection("Design Resources", "UI/UX resources and references", [
    {
      title: "Tailwind CSS Documentation",
      type: "link",
      url: "https://tailwindcss.com/docs",
      isFavorite: true,
      content: "Utility-first CSS framework — class references, config, and guides.",
    },
    {
      title: "shadcn/ui Components",
      type: "link",
      url: "https://ui.shadcn.com",
      content:
        "Beautifully designed, accessible components built with Radix UI and Tailwind CSS.",
    },
    {
      title: "Vercel Design System",
      type: "link",
      url: "https://vercel.com/geist/introduction",
      content: "Geist — Vercel's design system with typography, colors, and components.",
    },
    {
      title: "Lucide Icons",
      type: "link",
      url: "https://lucide.dev/icons",
      content: "Beautiful and consistent open-source icon library.",
    },
  ]);

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());