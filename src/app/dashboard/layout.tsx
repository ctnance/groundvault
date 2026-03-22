import { Search, Plus, Vault } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar, MobileSidebarToggle } from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/dashboard/SidebarProvider";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [itemTypes, collections] = await Promise.all([
    getSystemItemTypes(),
    getSidebarCollections(),
  ]);

  return (
    <TooltipProvider>
    <SidebarProvider>
      <div className="flex h-screen flex-col">
        {/* Top Bar */}
        <header className="flex h-14 items-center justify-between border-b border-border px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <MobileSidebarToggle />
            <Vault className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">GroundVault</span>
          </div>

          {/* Search */}
          <div className="flex max-w-md flex-1 items-center px-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              New Item
            </Button>
          </div>
        </header>

        {/* Body: Sidebar + Main */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar data={{ itemTypes, collections }} />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-10 py-6">
            <div className="mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </TooltipProvider>
  );
}