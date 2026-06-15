"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp, Compass, MountainSnow, Plus, ShieldCheck } from "lucide-react";

import { adminNavigation } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-3">
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-sidebar-primary/10 px-3 py-3"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Compass className="size-5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">Trip Planner Admin</p>
            <p className="truncate text-xs text-sidebar-foreground/65">Operations cockpit</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {adminNavigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            {group.label === "Inventory" ? (
              <SidebarGroupAction aria-label="Add inventory">
                <Plus className="size-4" />
              </SidebarGroupAction>
            ) : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-auto">
          <div className="rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/60 p-4 text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
            <div className="mb-3 flex items-center gap-2">
              <MountainSnow className="size-4" />
              <p className="text-sm font-semibold">Summer route window</p>
            </div>
            <p className="text-xs leading-5 text-sidebar-foreground/75">
              Peak inquiry traffic is trending toward Astore, Skardu, and Hunza. Keep hotel allocations tight.
            </p>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 px-3 py-2 text-left",
                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
              )}
            >
              <Avatar className="size-9 border border-sidebar-border/80">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">ZA</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium">Zain Admin</p>
                <p className="truncate text-xs text-sidebar-foreground/65">superadmin</p>
              </div>
              <ChevronUp className="size-4 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56">
              <DropdownMenuItem>
                <ShieldCheck className="mr-2 size-4" />
                Verified admin session
              </DropdownMenuItem>
              <DropdownMenuItem>Account settings</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/logout">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
