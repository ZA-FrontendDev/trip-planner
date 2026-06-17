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

export function HotelsManager() {
  const hotels = useQuery(api.hotels.list);
  const save = useMutation(api.hotels.save);
  const [form, setForm] = useState({
    name: "",
    location: "",
    stars: 4,
    pricePerNight: 5000,
    isVerified: true,
    images: [] as string[],
    amenities: "",
    roomTypes: "Standard Room|5000|2"
  });

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="display-font text-2xl">Hotels</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              await save({
                name: form.name,
                location: form.location,
                stars: form.stars,
                pricePerNight: form.pricePerNight,
                isVerified: form.isVerified,
                images: form.images,
                amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean),
                roomTypes: form.roomTypes.split("\n").map((line) => {
                  const [type, pricePerNight, capacity] = line.split("|").map((item) => item.trim());
                  return {
                    type,
                    pricePerNight: Number(pricePerNight),
                    capacity: Number(capacity)
                  };
                })
              });
              setForm({
                name: "",
                location: "",
                stars: 4,
                pricePerNight: 5000,
                isVerified: true,
                images: [],
                amenities: "",
                roomTypes: "Standard Room|5000|2"
              });
            }}
          >
            <AdminField label="Hotel name" hint="Enter the display name used in admin and trip itineraries.">
              <input className="input-base" placeholder="e.g. Naran Retreat" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            </AdminField>

            <AdminField label="Hotel location" hint="Enter the city or area where this hotel is located.">
              <input className="input-base" placeholder="e.g. Naran" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} required />
            </AdminField>

            <AdminField label="Star rating" hint="Set the hotel quality rating from 1 to 5 stars.">
              <input className="input-base" type="number" min="1" max="5" value={form.stars} onChange={(event) => setForm((current) => ({ ...current, stars: Number(event.target.value) }))} />
            </AdminField>

            <AdminField label="Base nightly price" hint="Enter the default price per night in PKR.">
              <input className="input-base" type="number" min="0" value={form.pricePerNight} onChange={(event) => setForm((current) => ({ ...current, pricePerNight: Number(event.target.value) }))} />
            </AdminField>

            <div className="md:col-span-2">
              <AdminImageUploader
                label="Hotel images"
                hint="Upload hotel photos. These images will be stored and reused across admin and frontend views."
                category="hotel"
                images={form.images}
                onChange={(images) => setForm((current) => ({ ...current, images }))}
              />
            </div>

            <AdminField label="Amenities" hint="Enter amenities as a comma-separated list, for example Breakfast, Parking, Mountain view.">
              <textarea className="textarea-base min-h-24" placeholder="Breakfast, Parking, Mountain view" value={form.amenities} onChange={(event) => setForm((current) => ({ ...current, amenities: event.target.value }))} />
            </AdminField>

            <AdminField label="Room types" hint="Add one room type per line using the format Type|Price|Capacity.">
              <textarea className="textarea-base min-h-24" placeholder="Deluxe Double|9200|2" value={form.roomTypes} onChange={(event) => setForm((current) => ({ ...current, roomTypes: event.target.value }))} />
            </AdminField>

            <div className="md:col-span-2 flex items-center justify-between gap-4 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.isVerified} onChange={(event) => setForm((current) => ({ ...current, isVerified: event.target.checked }))} />
                Mark this hotel as verified
              </label>
              <Button type="submit">Save hotel</Button>
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
                <TableHead>Location</TableHead>
                <TableHead>Stars</TableHead>
                <TableHead>Nightly</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels?.map((hotel: any) => (
                <TableRow key={hotel._id}>
                  <TableCell>
                    {hotel.images?.[0] ? (
                      <div className="relative h-14 w-20 overflow-hidden rounded-xl border border-slate-200">
                        <Image src={hotel.images[0]} alt={hotel.name} fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="flex h-14 w-20 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{hotel.name}</TableCell>
                  <TableCell>{hotel.location}</TableCell>
                  <TableCell>{hotel.stars}</TableCell>
                  <TableCell>{hotel.pricePerNight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
