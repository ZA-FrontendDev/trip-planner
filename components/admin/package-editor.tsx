"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { DEPARTURE_CITIES, DESTINATIONS, TRAVEL_CLASSES } from "@/lib/trip-options";
import { AdminField } from "@/components/admin/admin-field";
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
          className="grid gap-5 md:grid-cols-2"
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
          <AdminField label="Package title" hint="Enter the public title shown to travelers and admins.">
            <input className="input-base" placeholder="e.g. Astore | Minimarg | Deosai" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          </AdminField>

          <AdminField label="Package slug" hint="Enter a unique URL-friendly identifier such as astore-minimarg-deosai.">
            <input className="input-base" placeholder="astore-minimarg-deosai" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} required />
          </AdminField>

          <AdminField label="Destination" hint="Select the main destination this package belongs to.">
            <select className="select-base" value={form.destination} onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))}>
              {DESTINATIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </AdminField>

          <AdminField label="Departure city" hint="Select the city where this package starts.">
            <select className="select-base" value={form.departureCity} onChange={(event) => setForm((current) => ({ ...current, departureCity: event.target.value }))}>
              {DEPARTURE_CITIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </AdminField>

          <AdminField label="Duration in days" hint="Enter the total number of itinerary days for this package.">
            <input className="input-base" type="number" min="1" value={form.durationDays} onChange={(event) => setForm((current) => ({ ...current, durationDays: Number(event.target.value) }))} required />
          </AdminField>

          <AdminField label="Base package price" hint="Enter the base traveler price in PKR before hotel and vehicle adjustments.">
            <input className="input-base" type="number" min="0" value={form.basePrice} onChange={(event) => setForm((current) => ({ ...current, basePrice: Number(event.target.value) }))} required />
          </AdminField>

          <AdminField label="Maximum persons" hint="Set the maximum supported group size for this package.">
            <input className="input-base" type="number" min="1" value={form.maxPersons} onChange={(event) => setForm((current) => ({ ...current, maxPersons: Number(event.target.value) }))} required />
          </AdminField>

          <AdminField label="Travel class" hint="Choose whether this package is economy or business class.">
            <select className="select-base" value={form.travelClass} onChange={(event) => setForm((current) => ({ ...current, travelClass: event.target.value as "economy" | "business" }))}>
              {TRAVEL_CLASSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </AdminField>

          <AdminField label="Cover image URL" hint="Enter the main package image URL used on the frontend package listing." className="md:col-span-2">
            <input className="input-base" placeholder="https://..." value={form.coverImage} onChange={(event) => setForm((current) => ({ ...current, coverImage: event.target.value }))} required />
          </AdminField>

          <AdminField label="Default vehicle" hint="Optionally assign a default vehicle for new bookings created from this package.">
            <select className="select-base" value={form.defaultVehicleId} onChange={(event) => setForm((current) => ({ ...current, defaultVehicleId: event.target.value }))}>
              <option value="">No default vehicle</option>
              {vehicles?.map((vehicle: any) => (
                <option key={vehicle._id} value={vehicle._id as string}>
                  {vehicle.name}
                </option>
              ))}
            </select>
          </AdminField>

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
