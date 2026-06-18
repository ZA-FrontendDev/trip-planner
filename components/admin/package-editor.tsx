"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { CalendarDays, CarFront, ImageIcon, MapPinned } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { DEPARTURE_CITIES, DESTINATIONS, TRAVEL_CLASSES } from "@/lib/trip-options";
import { ItineraryBuilder } from "@/components/admin/itinerary-builder";
import { AdminField } from "@/components/admin/admin-field";
import { AdminImageUploader } from "@/components/admin/admin-image-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PackageEditor({ packageId }: { packageId?: string }) {
  const currentPackage = useQuery(api.packages.getById, packageId ? { packageId: packageId as never } : "skip");

  if (packageId && !currentPackage) {
    return <Card className="border-border/70 bg-white p-8 shadow-sm">Loading package...</Card>;
  }

  const initialValues = currentPackage
    ? {
        title: currentPackage.title,
        slug: currentPackage.slug,
        destination: currentPackage.destination,
        departureCity: currentPackage.departureCity,
        durationDays: currentPackage.durationDays,
        basePrice: currentPackage.basePrice,
        maxPersons: currentPackage.maxPersons,
        travelClass: currentPackage.travelClass,
        coverImage: currentPackage.coverImage,
        isActive: currentPackage.isActive,
        defaultVehicleId: (currentPackage.defaultVehicleId as string | undefined) ?? "",
      }
    : {
        title: "",
        slug: "",
        destination: DESTINATIONS[0],
        departureCity: DEPARTURE_CITIES[0],
        durationDays: 7,
        basePrice: 0,
        maxPersons: 4,
        travelClass: TRAVEL_CLASSES[0],
        coverImage: "",
        isActive: true,
        defaultVehicleId: "",
      };

  return <PackageEditorForm key={packageId ?? "new"} packageId={packageId} initialValues={initialValues} />;
}

function PackageEditorForm({
  packageId,
  initialValues,
}: {
  packageId?: string;
  initialValues: {
    title: string;
    slug: string;
    destination: string;
    departureCity: string;
    durationDays: number;
    basePrice: number;
    maxPersons: number;
    travelClass: "economy" | "business";
    coverImage: string;
    isActive: boolean;
    defaultVehicleId: string;
  };
}) {
  const router = useRouter();
  const vehicles = useQuery(api.vehicles.list);
  const createPackage = useMutation(api.packages.create);
  const updatePackage = useMutation(api.packages.update);
  const [form, setForm] = useState(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200/80 bg-[linear-gradient(135deg,#fcfffe_0%,#f3faf9_100%)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <CardTitle className="display-font text-3xl">
                {packageId ? "Edit package" : "Create package"}
              </CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-sm leading-6">
                Configure the sellable package first, then manage its day-wise route, covered places,
                place images, hotels, room assignments, and included vehicle in the same workflow.
              </CardDescription>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <WorkspaceStat
                icon={<MapPinned className="size-4" />}
                label="Destination"
                value={form.destination}
              />
              <WorkspaceStat
                icon={<CalendarDays className="size-4" />}
                label="Duration"
                value={`${form.durationDays} day${form.durationDays === 1 ? "" : "s"}`}
              />
              <WorkspaceStat
                icon={<CarFront className="size-4" />}
                label="Vehicle"
                value={
                  vehicles?.find((vehicle: any) => vehicle._id === form.defaultVehicleId)?.name ??
                  "Select vehicle"
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            className="grid gap-5 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              setIsSaving(true);
              setNotice(null);

              const payload = {
                ...form,
                defaultVehicleId: form.defaultVehicleId ? (form.defaultVehicleId as never) : undefined,
              };

              try {
                if (packageId) {
                  await updatePackage({ packageId: packageId as never, ...payload });
                  setNotice("Package details saved. Day-wise itinerary below stays connected to this package.");
                  router.refresh();
                  return;
                }

                const nextId = await createPackage(payload);
                router.push(`/admin/packages/${nextId as string}/edit`);
              } finally {
                setIsSaving(false);
              }
            }}
          >
            <AdminField label="Package title" hint="Public title shown on package cards and itinerary pages.">
              <input
                className="input-base"
                placeholder="e.g. Astore | Minimarg | Deosai"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                required
              />
            </AdminField>

            <AdminField label="Package slug" hint="Unique URL-friendly slug used for internal routing and lookup.">
              <input
                className="input-base"
                placeholder="astore-minimarg-deosai"
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                required
              />
            </AdminField>

            <AdminField label="Destination" hint="Primary destination used for package matching.">
              <select
                className="select-base"
                value={form.destination}
                onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))}
              >
                {DESTINATIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Departure city" hint="Origin city travelers select on the public booking form.">
              <select
                className="select-base"
                value={form.departureCity}
                onChange={(event) => setForm((current) => ({ ...current, departureCity: event.target.value }))}
              >
                {DEPARTURE_CITIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Trip duration in days" hint="Number of itinerary day cards that should exist for this package.">
              <input
                className="input-base"
                type="number"
                min="1"
                value={form.durationDays}
                onChange={(event) => setForm((current) => ({ ...current, durationDays: Number(event.target.value) }))}
                required
              />
            </AdminField>

            <AdminField label="Base package price (PKR)" hint="Per-adult base price before hotel and vehicle adjustments.">
              <input
                className="input-base"
                type="number"
                min="0"
                value={form.basePrice}
                onChange={(event) => setForm((current) => ({ ...current, basePrice: Number(event.target.value) }))}
                required
              />
            </AdminField>

            <AdminField label="Maximum persons" hint="Largest group size this package should match against.">
              <input
                className="input-base"
                type="number"
                min="1"
                value={form.maxPersons}
                onChange={(event) => setForm((current) => ({ ...current, maxPersons: Number(event.target.value) }))}
                required
              />
            </AdminField>

            <AdminField label="Travel class" hint="Booking engine uses this when matching user trip criteria.">
              <select
                className="select-base"
                value={form.travelClass}
                onChange={(event) =>
                  setForm((current) => ({ ...current, travelClass: event.target.value as "economy" | "business" }))
                }
              >
                {TRAVEL_CLASSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Included vehicle" hint="Default vehicle pre-selected when a booking is created from this package.">
              <select
                className="select-base"
                value={form.defaultVehicleId}
                onChange={(event) => setForm((current) => ({ ...current, defaultVehicleId: event.target.value }))}
              >
                <option value="">No default vehicle</option>
                {vehicles?.map((vehicle: any) => (
                  <option key={vehicle._id} value={vehicle._id as string}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </AdminField>

            <div className="md:col-span-2">
              <AdminImageUploader
                label="Package cover image"
                hint="Upload the hero image used for package cards and any place-image fallback."
                category="package"
                images={form.coverImage ? [form.coverImage] : []}
                onChange={(images) =>
                  setForm((current) => ({
                    ...current,
                    coverImage: images[0] ?? "",
                  }))
                }
              />
              {!form.coverImage ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                  <ImageIcon className="size-3.5" />
                  Upload a cover image before publishing this package.
                </div>
              ) : null}
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
              />
              Package active and available for public trip matching
            </label>

            <div className="flex items-center justify-end gap-3 md:col-span-2">
              {notice ? <p className="mr-auto text-sm text-emerald-700">{notice}</p> : null}
              <Button type="button" variant="outline" onClick={() => router.push("/admin/packages")}>
                Back to packages
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : packageId ? "Save package details" : "Create package and continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {packageId ? <ItineraryBuilder packageId={packageId} /> : null}
    </div>
  );
}

function WorkspaceStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
