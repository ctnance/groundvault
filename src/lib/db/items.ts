import { prisma } from "@/lib/prisma";

// Temporary: use demo user until auth is set up
const DEMO_EMAIL = "demo@groundvault.io";

async function getDemoUserId() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });
  if (!user) throw new Error("Demo user not found. Run `npm run db:seed` first.");
  return user.id;
}

export type ItemWithType = {
  id: string;
  title: string;
  content: string | null;
  description: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  itemType: { icon: string; color: string };
  tags: { id: string; name: string }[];
  createdAt: Date;
};

const itemSelect = {
  id: true,
  title: true,
  content: true,
  description: true,
  language: true,
  isFavorite: true,
  isPinned: true,
  createdAt: true,
  itemType: { select: { icon: true, color: true } },
  tags: { select: { id: true, name: true } },
} as const;

export async function getPinnedItems(): Promise<ItemWithType[]> {
  const userId = await getDemoUserId();

  return prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { createdAt: "desc" },
    select: itemSelect,
  });
}

export async function getRecentItems(limit = 10): Promise<ItemWithType[]> {
  const userId = await getDemoUserId();

  return prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: itemSelect,
  });
}

// ─── Item Types ─────────────────────────────────────────

export type SystemItemType = {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
};

const TYPE_ORDER = [
  "Snippets",
  "Prompts",
  "Commands",
  "Notes",
  "Files",
  "Images",
  "Links",
];

export async function getSystemItemTypes(): Promise<SystemItemType[]> {
  const userId = await getDemoUserId();

  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    select: {
      id: true,
      name: true,
      icon: true,
      color: true,
      _count: { select: { items: { where: { userId } } } },
    },
  });

  const mapped = types.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    color: t.color,
    itemCount: t._count.items,
  }));

  mapped.sort((a, b) => {
    const ai = TYPE_ORDER.indexOf(a.name);
    const bi = TYPE_ORDER.indexOf(b.name);
    return (ai === -1 ? TYPE_ORDER.length : ai) - (bi === -1 ? TYPE_ORDER.length : bi);
  });

  return mapped;
}