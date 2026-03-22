import { prisma } from "@/lib/prisma";

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

export async function getPinnedItems(userId: string, limit = 20): Promise<ItemWithType[]> {
  return prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: itemSelect,
  });
}

export async function getRecentItems(userId: string, limit = 10): Promise<ItemWithType[]> {

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
  "snippet",
  "prompt",
  "command",
  "note",
  "file",
  "image",
  "link",
];

export async function getSystemItemTypes(userId: string): Promise<SystemItemType[]> {

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