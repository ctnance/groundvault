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

export type CollectionWithTypeCounts = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  types: { icon: string; color: string; count: number }[];
};

export async function getCollections(): Promise<CollectionWithTypeCounts[]> {
  const userId = await getDemoUserId();

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          item: {
            select: {
              itemType: { select: { icon: true, color: true } },
            },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    // Count items per type
    const typeCounts = new Map<string, { icon: string; color: string; count: number }>();
    for (const ic of col.items) {
      const { icon, color } = ic.item.itemType;
      const key = icon;
      const existing = typeCounts.get(key);
      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(key, { icon, color, count: 1 });
      }
    }

    // Sort by count descending so the dominant type comes first
    const types = Array.from(typeCounts.values()).sort((a, b) => b.count - a.count);

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      types,
    };
  });
}

export type DashboardStats = {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const userId = await getDemoUserId();

  const [totalItems, totalCollections, favoriteItems, favoriteCollections] =
    await Promise.all([
      prisma.item.count({ where: { userId } }),
      prisma.collection.count({ where: { userId } }),
      prisma.item.count({ where: { userId, isFavorite: true } }),
      prisma.collection.count({ where: { userId, isFavorite: true } }),
    ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}