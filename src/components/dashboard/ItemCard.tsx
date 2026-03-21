import {
  Code,
  StickyNote,
  Terminal,
  File,
  Sparkles,
  Image,
  Link as LinkIcon,
  Pin,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Item } from "@/lib/mock-data";

const iconMap: Record<string, LucideIcon> = {
  Code,
  StickyNote,
  Terminal,
  File,
  Sparkles,
  Image,
  Link: LinkIcon,
};

export function ItemCard({ item }: { item: Item }) {
  const Icon = iconMap[item.itemType.icon] ?? Code;

  return (
    <Card
      className="group cursor-pointer transition-colors hover:bg-accent/50"
      style={{ borderLeftColor: item.itemType.color, borderLeftWidth: "3px" }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon
              className="h-4 w-4 flex-shrink-0"
              style={{ color: item.itemType.color }}
            />
            <h3 className="truncate text-sm font-semibold">{item.title}</h3>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1">
            {item.isPinned && (
              <Pin className="h-3.5 w-3.5 fill-muted-foreground text-muted-foreground" />
            )}
            {item.isFavorite && (
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        </div>

        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
            {item.description}
          </p>
        )}

        {item.content && (
          <pre className="mt-2 line-clamp-3 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
            <code>{item.content}</code>
          </pre>
        )}

        {item.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}