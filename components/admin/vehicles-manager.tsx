"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { AdminField } from "@/components/admin/admin-field";
import { AdminImageUploader } from "@/components/admin/admin-image-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function VehiclesManager() {
  const vehicles = useQuery(api.vehicles.list);
  const save = useMutation(api.vehicles.save);
  const [form, setForm] = useState({
    name: "",
    type: "suv",
    capacity: 4,
    pricePerDay: 10000,
    images: [] as string[],
    features: "",
    isAvailable: true
  });

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="display-font text-2xl">Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              await save({
                name: form.name,
                type: form.type,
                capacity: form.capacity,
                pricePerDay: form.pricePerDay,
                images: form.images,
                features: form.features.split(",").map((item) => item.trim()).filter(Boolean),
                isAvailable: form.isAvailable
              });
              setForm({
                name: "",
                type: "suv",
                capacity: 4,
                pricePerDay: 10000,
                images: [],
                features: "",
                isAvailable: true
              });
            }}
          >
            <AdminField label="Vehicle name" hint="Enter the public display name of the vehicle.">
              <input className="input-base" placeholder="e.g. Honda BRV" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            </AdminField>

            <AdminField label="Vehicle type" hint="Describe the vehicle class, for example suv, van, or coaster.">
              <input className="input-base" placeholder="e.g. suv" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} required />
            </AdminField>

            <AdminField label="Passenger capacity" hint="Enter how many travelers this vehicle can carry.">
              <input className="input-base" type="number" min="1" value={form.capacity} onChange={(event) => setForm((current) => ({ ...current, capacity: Number(event.target.value) }))} required />
            </AdminField>

            <AdminField label="Daily price" hint="Enter the vehicle rental price per day in PKR.">
              <input className="input-base" type="number" min="0" value={form.pricePerDay} onChange={(event) => setForm((current) => ({ ...current, pricePerDay: Number(event.target.value) }))} required />
            </AdminField>

            <div className="md:col-span-2">
              <AdminImageUploader
                label="Vehicle images"
                hint="Upload vehicle photos. These images will be displayed in admin records and any frontend views that use vehicle media."
                category="vehicle"
                images={form.images}
                onChange={(images) => setForm((current) => ({ ...current, images }))}
              />
            </div>

            <AdminField label="Vehicle features" hint="Enter features as a comma-separated list, for example AC, Comfortable seats, Luggage space.">
              <textarea className="textarea-base min-h-24" placeholder="AC, Comfortable seats, Luggage space" value={form.features} onChange={(event) => setForm((current) => ({ ...current, features: event.target.value }))} />
            </AdminField>

            <div className="md:col-span-2 flex items-center justify-between gap-4 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.isAvailable} onChange={(event) => setForm((current) => ({ ...current, isAvailable: event.target.checked }))} />
                Vehicle is available for booking
              </label>
              <Button type="submit">Save vehicle</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-white shadow-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Daily price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles?.map((vehicle: any) => (
                <TableRow key={vehicle._id}>
                  <TableCell>
                    {vehicle.images?.[0] ? (
                      <div className="relative h-14 w-20 overflow-hidden rounded-xl border border-slate-200">
                        <Image src={vehicle.images[0]} alt={vehicle.name} fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="flex h-14 w-20 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{vehicle.name}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.capacity}</TableCell>
                  <TableCell>{vehicle.pricePerDay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
