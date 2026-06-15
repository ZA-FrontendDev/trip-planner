"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { DEPARTURE_CITIES, DESTINATIONS, TRAVEL_CLASSES } from "@/lib/trip-options";
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
        defaultVehicleId: (currentPackage.defaultVehicleId as string | undefined) ?? ""
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
        defaultVehicleId: ""
      };

  return <PackageEditorForm key={packageId ?? "new"} packageId={packageId} initialValues={initialValues} />;
}

function PackageEditorForm({
  packageId,
  initialValues
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

  return (
    <Card className="border-border/70 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="display-font text-2xl">{packageId ? "Edit package" : "Create package"}</CardTitle>
        <CardDescription>Package records are the source of truth for public bookings and itinerary routing.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const payload = {
              ...form,
              defaultVehicleId: form.defaultVehicleId ? (form.defaultVehicleId as never) : undefined
            };

            if (packageId) {
              await updatePackage({ packageId: packageId as never, ...payload });
              router.push("/admin/packages");
              return;
            }

            const nextId = await createPackage(payload);
            router.push(`/admin/packages/${nextId as string}/itinerary`);
          }}
        >
          <input className="input-base" placeholder="Title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          <input className="input-base" placeholder="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} required />
          <select className="input-base" value={form.destination} onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))}>
            {DESTINATIONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select className="input-base" value={form.departureCity} onChange={(event) => setForm((current) => ({ ...current, departureCity: event.target.value }))}>
            {DEPARTURE_CITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <input className="input-base" type="number" min="1" value={form.durationDays} onChange={(event) => setForm((current) => ({ ...current, durationDays: Number(event.target.value) }))} required />
          <input className="input-base" type="number" min="0" value={form.basePrice} onChange={(event) => setForm((current) => ({ ...current, basePrice: Number(event.target.value) }))} required />
          <input className="input-base" type="number" min="1" value={form.maxPersons} onChange={(event) => setForm((current) => ({ ...current, maxPersons: Number(event.target.value) }))} required />
          <select className="input-base" value={form.travelClass} onChange={(event) => setForm((current) => ({ ...current, travelClass: event.target.value as "economy" | "business" }))}>
            {TRAVEL_CLASSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input className="input-base md:col-span-2" placeholder="Cover image URL" value={form.coverImage} onChange={(event) => setForm((current) => ({ ...current, coverImage: event.target.value }))} required />
          <select className="input-base" value={form.defaultVehicleId} onChange={(event) => setForm((current) => ({ ...current, defaultVehicleId: event.target.value }))}>
            <option value="">No default vehicle</option>
            {vehicles?.map((vehicle: any) => (
              <option key={vehicle._id} value={vehicle._id as string}>
                {vehicle.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
            Package active and bookable
          </label>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/packages")}>
              Cancel
            </Button>
            <Button type="submit">{packageId ? "Save package" : "Create package"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
