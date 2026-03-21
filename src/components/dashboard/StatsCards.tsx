import { FolderOpen, LayoutGrid, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/db/collections";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const items = [
    { label: "Items", value: stats.totalItems, icon: LayoutGrid, color: "text-blue-400" },
    { label: "Collections", value: stats.totalCollections, icon: FolderOpen, color: "text-purple-400" },
    { label: "Favorite Items", value: stats.favoriteItems, icon: Star, color: "text-yellow-400" },
    { label: "Favorite Collections", value: stats.favoriteCollections, icon: Star, color: "text-yellow-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`rounded-lg bg-muted p-2.5 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}