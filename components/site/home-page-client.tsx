"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { BootstrapData } from "@/components/shared/bootstrap-data";
import { HeroSection } from "@/components/site/hero-section";
import { PackageCard } from "@/components/site/package-card";

export function HomePageClient() {
  const homeData = useQuery(api.site.getHomeData);

  return (
    <>
      <HeroSection />

      <section className="section-shell pt-10">
        <BootstrapData />
      </section>

      <section className="section-shell pt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Featured Packages</p>
            <h2 className="display-font mt-3 text-3xl font-semibold text-ink">Preview the route style</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Featured routes are now loaded from Convex and mirror the same package records used by booking and admin flows.
          </p>
        </div>

        {homeData?.featuredPackages?.length ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {homeData.featuredPackages.map((tripPackage: any) => (
              <PackageCard
                key={tripPackage._id}
                slug={tripPackage.slug}
                title={tripPackage.title}
                duration={`${tripPackage.durationDays} Days`}
                price={tripPackage.priceLabel}
                summary={tripPackage.summary}
                image={tripPackage.coverImage}
              />
            ))}
          </div>
        ) : (
          <div className="card-surface p-8 text-sm text-slate-600">Loading package catalog...</div>
        )}
      </section>
    </>
  );
}
