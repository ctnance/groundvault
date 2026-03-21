import { FolderOpen, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Collection } from "@/lib/mock-data";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Card className="group cursor-pointer transition-colors hover:bg-accent/50">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
          <FolderOpen className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{collection.name}</h3>
            {collection.isFavorite && (
              <Star className="h-3.5 w-3.5 flex-shrink-0 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          {collection.description && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {collection.description}
            </p>
          )}
          <p className="mt-1.5 text-xs text-muted-foreground">
            {collection.itemCount} items
          </p>
        </div>
      </CardContent>
    </Card>
  );
}