import {
  Code,
  StickyNote,
  Terminal,
  File,
  Sparkles,
  Image,
  Link as LinkIcon,
  FolderOpen,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CollectionWithTypeCounts } from "@/lib/db/collections";

const iconMap: Record<string, LucideIcon> = {
  Code,
  StickyNote,
  Terminal,
  File,
  Sparkles,
  Image,
  Link: LinkIcon,
};

export function CollectionCard({ collection }: { collection: CollectionWithTypeCounts }) {
  // Border color from the most-used type, fallback to purple
  const dominantColor = collection.types[0]?.color ?? "#a855f7";

  return (
    <Card
      className="group cursor-pointer transition-colors hover:bg-accent/50"
      style={{ borderTopColor: dominantColor, borderTopWidth: "3px" }}
    >
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className="rounded-lg p-2"
          style={{ backgroundColor: `${dominantColor}15`, color: dominantColor }}
        >
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
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
            </span>
            {collection.types.length > 0 && (
              <div className="flex items-center gap-1">
                {collection.types.map((type) => {
                  const Icon = iconMap[type.icon] ?? Code;
                  return (
                    <Icon
                      key={type.icon}
                      className="h-3 w-3"
                      style={{ color: type.color }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}