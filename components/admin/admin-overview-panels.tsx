import Link from "next/link";
import { ArrowRight, CircleCheckBig, Sparkles } from "lucide-react";

import { adminTasks, quickActions } from "@/lib/admin-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminOverviewPanels() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="border-border/70 bg-white shadow-sm">
        <CardHeader>
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <Sparkles className="size-3.5" />
            Quick actions
          </div>
          <CardTitle className="display-font text-xl">Keep package operations moving</CardTitle>
          <CardDescription>
            Start with the tasks that directly affect the public trip-builder flow and itinerary fulfillment.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="rounded-2xl border border-border/70 bg-muted/40 p-4 transition hover:border-primary/40 hover:bg-primary/5"
            >
              <h3 className="font-semibold text-foreground">{action.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Open
                <ArrowRight className="size-4" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-[linear-gradient(180deg,rgba(13,124,110,0.08),rgba(255,255,255,1))] shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="display-font text-xl">Operational watchlist</CardTitle>
              <CardDescription>Immediate itinerary and inventory items.</CardDescription>
            </div>
            <Badge variant="outline">3 active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {adminTasks.map((task) => (
            <div key={task.title} className="rounded-2xl border border-border/70 bg-white/85 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CircleCheckBig className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{task.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{task.detail}</p>
                </div>
              </div>
            </div>
          ))}
          <Button asChild className="w-full">
            <Link href="/admin/packages">Open package builder</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
