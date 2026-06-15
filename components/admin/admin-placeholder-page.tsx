import Link from "next/link";
import { ArrowRight, DraftingCompass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AdminPlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
};

export function AdminPlaceholderPage({
  eyebrow,
  title,
  description,
  ctaHref,
  ctaLabel
}: AdminPlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-border/70 bg-[linear-gradient(135deg,rgba(13,124,110,0.12),rgba(255,255,255,0.92))] p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
        <h1 className="display-font mt-3 text-3xl font-semibold text-foreground">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>
      </section>

      <Card className="border-border/70 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="display-font text-xl">Section scaffolded</CardTitle>
          <CardDescription>
            The admin shell and navigation are live. This page is ready for the next CRUD and Convex-backed step.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <DraftingCompass className="size-4 text-primary" />
            Next pass should connect this area to the schema described in `TRIP_PLANNER.md`.
          </div>
          <Button asChild>
            <Link href={ctaHref}>
              {ctaLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
