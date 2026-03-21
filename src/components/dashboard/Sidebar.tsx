"use client";

import { useState } from "react";
import Link from "next/link";
import { useSidebar } from "./SidebarProvider";
import {
  Code,
  StickyNote,
  Terminal,
  File,
  Sparkles,
  Image,
  Link as LinkIcon,
  Star,
  Clock,
  FolderOpen,
  PanelLeft,
  LayoutGrid,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  itemTypes,
  items,
  collections,
  currentUser,
  type ItemType,
} from "@/lib/mock-data";

const iconMap: Record<string, LucideIcon> = {
  Code,
  StickyNote,
  Terminal,
  File,
  Sparkles,
  Image,
  Link: LinkIcon,
};

function getTypeSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function getItemCountForType(typeId: string) {
  return items.filter((item) => item.itemType.id === typeId).length;
}

// ─── Sidebar Content (shared between desktop & mobile) ──

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.slice(0, 4);

  return (
    <div className="flex h-full flex-col">
      {/* All Items */}
      <div className="px-3 py-2">
        <NavLink
          href="/dashboard"
          icon={LayoutGrid}
          label="All Items"
          collapsed={collapsed}
        />
      </div>

      <Separator />

      {/* Item Types */}
      <div className="flex-shrink-0 px-3 py-2">
        {!collapsed && (
          <span className="mb-1 block px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Types
          </span>
        )}
        <nav className="flex flex-col gap-0.5">
          {itemTypes.map((type) => (
            <TypeLink key={type.id} type={type} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      <Separator />

      {/* Collections (with Favorites & Recent subsections) */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {!collapsed ? (
          <button
            onClick={() => setCollectionsOpen(!collectionsOpen)}
            className="mb-1 flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            Collections
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                collectionsOpen ? "" : "-rotate-90"
              }`}
            />
          </button>
        ) : (
          <div className="mb-1 flex justify-center">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        {(collectionsOpen || collapsed) && (
          <nav className="flex flex-col gap-0.5">
            {/* Favorites subsection */}
            {!collapsed && favoriteCollections.length > 0 && (
              <span className="mt-1 block px-2 text-[11px] font-medium text-muted-foreground/70">
                Favorites
              </span>
            )}
            {favoriteCollections.map((col) => (
              <NavLink
                key={`fav-${col.id}`}
                href={`/collections/${col.id}`}
                icon={Star}
                label={col.name}
                collapsed={collapsed}
                count={col.itemCount}
                iconClassName="fill-yellow-400 text-yellow-400"
              />
            ))}

            {/* Recent subsection */}
            {!collapsed && recentCollections.length > 0 && (
              <span className="mt-2 block px-2 text-[11px] font-medium text-muted-foreground/70">
                Recent
              </span>
            )}
            {recentCollections.map((col) => (
              <NavLink
                key={`recent-${col.id}`}
                href={`/collections/${col.id}`}
                icon={Clock}
                label={col.name}
                collapsed={collapsed}
                count={col.itemCount}
              />
            ))}

            {/* All collections subsection */}
            {!collapsed && (
              <span className="mt-2 block px-2 text-[11px] font-medium text-muted-foreground/70">
                All
              </span>
            )}
            {collections.map((col) => (
              <NavLink
                key={`all-${col.id}`}
                href={`/collections/${col.id}`}
                icon={FolderOpen}
                label={col.name}
                collapsed={collapsed}
                count={col.itemCount}
              />
            ))}
          </nav>
        )}
      </div>

      {/* User avatar area */}
      <Separator />
      <div className="flex-shrink-0 px-3 py-3">
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : "px-2"}`}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {currentUser.name?.charAt(0) ?? "U"}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {currentUser.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Nav Link ───────────────────────────────────────────

function NavLink({
  href,
  icon: Icon,
  label,
  collapsed,
  count,
  color,
  iconClassName,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  count?: number;
  color?: string;
  iconClassName?: string;
}) {
  const content = (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
    >
      <Icon
        className={`h-4 w-4 flex-shrink-0 ${iconClassName ?? ""}`}
        style={color ? { color } : undefined}
      />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {count !== undefined && (
            <span className="text-xs text-muted-foreground">{count}</span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<div />}>{content}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ─── Type Link (with color + count) ─────────────────────

function TypeLink({
  type,
  collapsed,
}: {
  type: ItemType;
  collapsed: boolean;
}) {
  const Icon = iconMap[type.icon] ?? Code;
  const count = getItemCountForType(type.id);

  return (
    <NavLink
      href={`/items/${getTypeSlug(type.name)}`}
      icon={Icon}
      label={type.name}
      collapsed={collapsed}
      color={type.color}
      count={count}
    />
  );
}

// ─── Mobile Toggle (rendered in the header) ────────────

export function MobileSidebarToggle() {
  const { setMobileOpen } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={() => setMobileOpen(true)}
      aria-label="Open sidebar"
    >
      <PanelLeft className="h-5 w-5" />
    </Button>
  );
}

// ─── Main Sidebar Export ────────────────────────────────

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-60 p-0" showCloseButton>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside
        className={`hidden border-r border-border transition-[width] duration-200 md:flex md:flex-col ${
          collapsed ? "w-14" : "w-60"
        }`}
      >
        {/* Collapse toggle */}
        <div
          className={`flex h-10 items-center border-b border-border px-3 ${
            collapsed ? "justify-center" : "justify-end"
          }`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>

        <SidebarNav collapsed={collapsed} />
      </aside>
    </>
  );
}