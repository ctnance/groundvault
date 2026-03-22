import { StatsCards } from "@/components/dashboard/StatsCards";
import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { getCollections, getDashboardStats } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems } from "@/lib/db/items";
import { getDemoUserId } from "@/lib/db/user";

export default async function DashboardPage() {
  const userId = await getDemoUserId();
  if (!userId) return <div className="p-8 text-muted-foreground">No user found.</div>;

  const [collections, stats, pinnedItems, recentItems] = await Promise.all([
    getCollections(userId),
    getDashboardStats(userId),
    getPinnedItems(userId),
    getRecentItems(userId),
  ]);

  const recentCollections = collections.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Recent Collections */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Collections
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Pinned Items
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Items
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}