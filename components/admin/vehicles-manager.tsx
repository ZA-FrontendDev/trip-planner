"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
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
    images: "",
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
            className="grid gap-4 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              await save({
                name: form.name,
                type: form.type,
                capacity: form.capacity,
                pricePerDay: form.pricePerDay,
                images: form.images.split("\n").map((item) => item.trim()).filter(Boolean),
                features: form.features.split(",").map((item) => item.trim()).filter(Boolean),
                isAvailable: form.isAvailable
              });
              setForm({
                name: "",
                type: "suv",
                capacity: 4,
                pricePerDay: 10000,
                images: "",
                features: "",
                isAvailable: true
              });
            }}
          >
            <input className="input-base" placeholder="Vehicle name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            <input className="input-base" placeholder="Vehicle type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} required />
            <input className="input-base" type="number" min="1" value={form.capacity} onChange={(event) => setForm((current) => ({ ...current, capacity: Number(event.target.value) }))} required />
            <input className="input-base" type="number" min="0" value={form.pricePerDay} onChange={(event) => setForm((current) => ({ ...current, pricePerDay: Number(event.target.value) }))} required />
            <textarea className="textarea-base min-h-24" placeholder="Image URLs, one per line" value={form.images} onChange={(event) => setForm((current) => ({ ...current, images: event.target.value }))} />
            <textarea className="textarea-base min-h-24" placeholder="Features, comma separated" value={form.features} onChange={(event) => setForm((current) => ({ ...current, features: event.target.value }))} />
            <div className="md:col-span-2 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.isAvailable} onChange={(event) => setForm((current) => ({ ...current, isAvailable: event.target.checked }))} />
                Available for booking
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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Daily price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles?.map((vehicle: any) => (
                <TableRow key={vehicle._id}>
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
