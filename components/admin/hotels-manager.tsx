"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
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
    images: "",
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
            className="grid gap-4 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              await save({
                name: form.name,
                location: form.location,
                stars: form.stars,
                pricePerNight: form.pricePerNight,
                isVerified: form.isVerified,
                images: form.images.split("\n").map((item) => item.trim()).filter(Boolean),
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
                images: "",
                amenities: "",
                roomTypes: "Standard Room|5000|2"
              });
            }}
          >
            <input className="input-base" placeholder="Hotel name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            <input className="input-base" placeholder="Location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} required />
            <input className="input-base" type="number" min="1" max="5" value={form.stars} onChange={(event) => setForm((current) => ({ ...current, stars: Number(event.target.value) }))} />
            <input className="input-base" type="number" min="0" value={form.pricePerNight} onChange={(event) => setForm((current) => ({ ...current, pricePerNight: Number(event.target.value) }))} />
            <textarea className="textarea-base min-h-24" placeholder="Image URLs, one per line" value={form.images} onChange={(event) => setForm((current) => ({ ...current, images: event.target.value }))} />
            <textarea className="textarea-base min-h-24" placeholder="Amenities, comma separated" value={form.amenities} onChange={(event) => setForm((current) => ({ ...current, amenities: event.target.value }))} />
            <textarea className="textarea-base md:col-span-2 min-h-24" placeholder="Room types, one per line. Format: Type|Price|Capacity" value={form.roomTypes} onChange={(event) => setForm((current) => ({ ...current, roomTypes: event.target.value }))} />
            <div className="md:col-span-2 flex justify-end">
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
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Stars</TableHead>
                <TableHead>Nightly</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels?.map((hotel: any) => (
                <TableRow key={hotel._id}>
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
