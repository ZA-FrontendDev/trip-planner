import { Bell, CalendarDays, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminShellHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Admin panel</p>
            <h1 className="display-font text-xl font-semibold text-foreground">Pakistan Trip Planner</h1>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search packages, hotels, bookings..." />
          </div>
          <Button variant="outline" className="justify-start gap-2">
            <CalendarDays className="size-4" />
            12 Jun 2026
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="size-4" />
            <span className="sr-only">Open notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
