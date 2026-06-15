import { ArrowUpRight } from "lucide-react";

import { adminMetrics } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const toneClasses = {
  teal: "bg-primary/12 text-primary",
  amber: "bg-amber-100 text-amber-700",
  slate: "bg-slate-100 text-slate-700"
};

export function DashboardStats() {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {adminMetrics.map((metric) => (
        <Card key={metric.label} className="border-border/70 bg-white shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
              <div className={cn("flex size-10 items-center justify-center rounded-xl", toneClasses[metric.tone])}>
                <metric.icon className="size-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <p className="display-font text-3xl font-semibold text-foreground">{metric.value}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpRight className="size-4 text-primary" />
              <span>{metric.delta}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
