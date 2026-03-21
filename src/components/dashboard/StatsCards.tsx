import { FolderOpen, LayoutGrid, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { items, collections } from "@/lib/mock-data";

export function StatsCards() {
  const totalItems = items.length;
  const totalCollections = collections.length;
  const favoriteItems = items.filter((i) => i.isFavorite).length;
  const favoriteCollections = collections.filter((c) => c.isFavorite).length;

  const stats = [
    { label: "Items", value: totalItems, icon: LayoutGrid, color: "text-blue-400" },
    { label: "Collections", value: totalCollections, icon: FolderOpen, color: "text-purple-400" },
    { label: "Favorite Items", value: favoriteItems, icon: Star, color: "text-yellow-400" },
    { label: "Favorite Collections", value: favoriteCollections, icon: Star, color: "text-yellow-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
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