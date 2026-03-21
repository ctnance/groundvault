import { Search, Plus, Vault } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currentUser } from "@/lib/mock-data";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b border-border px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {currentUser.name?.charAt(0) ?? "U"}
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 border-r border-border p-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Sidebar</h2>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}