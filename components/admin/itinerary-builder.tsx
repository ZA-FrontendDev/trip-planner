"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { SiteHotel } from "@/lib/trip-types";
import { AdminField } from "@/components/admin/admin-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ItineraryDayRecord = {
  _id: string;
  dayNumber: number;
  title: string;
  description: string;
  overnightLocation: string;
  assignment?: {
    hotelId: string;
  } | null;
};

export function ItineraryBuilder({ packageId }: { packageId: string }) {
  const packageRecord = useQuery(api.packages.getById, { packageId: packageId as never });
  const days = useQuery(api.itinerary.getForPackage, { packageId: packageId as never });
  const hotels = useQuery(api.hotels.list);
  const saveDay = useMutation(api.itinerary.saveDay);
  const removeDay = useMutation(api.itinerary.removeDay);
  const hotelRecords = (hotels ?? []) as SiteHotel[];
  const dayRecords = (days ?? []) as ItineraryDayRecord[];

  const [draft, setDraft] = useState({
    dayNumber: 1,
    date: "2026-06-11",
    title: "",
    description: "",
    overnightLocation: "",
    placesCoveredText: "",
    hotelId: "",
    roomType: "",
    quantity: 1
  });

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="display-font text-2xl">Itinerary builder</CardTitle>
          <CardDescription>
            {packageRecord ? `Editing itinerary days for ${packageRecord.title}.` : "Loading package..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              const placesCovered = draft.placesCoveredText
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [name, image] = line.split("|").map((item) => item.trim());
                  return { name, image };
                });

              await saveDay({
                packageId: packageId as never,
                dayNumber: draft.dayNumber,
                date: draft.date,
                title: draft.title,
                description: draft.description,
                overnightLocation: draft.overnightLocation,
                placesCovered,
                hotelId: draft.hotelId ? (draft.hotelId as never) : undefined,
                roomType: draft.roomType || undefined,
                quantity: draft.quantity
              });

              setDraft({
                dayNumber: draft.dayNumber + 1,
                date: draft.date,
                title: "",
                description: "",
                overnightLocation: "",
                placesCoveredText: "",
                hotelId: "",
                roomType: "",
                quantity: 1
              });
            }}
          >
            <AdminField label="Day number" hint="Enter the numerical order of this itinerary day.">
              <input className="input-base" type="number" min="1" value={draft.dayNumber} onChange={(event) => setDraft((current) => ({ ...current, dayNumber: Number(event.target.value) }))} />
            </AdminField>
            <AdminField label="Day date" hint="Choose the calendar date for this itinerary day.">
              <input className="date-base" type="date" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} />
            </AdminField>
            <AdminField label="Day title" hint="Enter the main route or trip headline for this day." className="md:col-span-2">
              <input className="input-base" placeholder="e.g. Islamabad to Naran" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} required />
            </AdminField>
            <AdminField label="Route description" hint="Describe the travel flow, stopovers, and major activities for this day." className="md:col-span-2">
              <textarea className="textarea-base min-h-28" placeholder="Departure, stops, arrivals, activities..." value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} required />
            </AdminField>
            <AdminField label="Overnight location" hint="Enter the place where travelers will stay overnight.">
              <input className="input-base" placeholder="e.g. Astore" value={draft.overnightLocation} onChange={(event) => setDraft((current) => ({ ...current, overnightLocation: event.target.value }))} required />
            </AdminField>
            <AdminField label="Assigned hotel" hint="Choose the hotel assigned to this itinerary day, if any.">
              <select className="select-base" value={draft.hotelId} onChange={(event) => {
                const nextHotel = hotelRecords.find((hotel) => hotel._id === event.target.value);
                setDraft((current) => ({
                  ...current,
                  hotelId: event.target.value,
                  roomType: nextHotel?.roomTypes?.[0]?.type ?? ""
                }));
              }}>
                <option value="">No hotel assignment</option>
                {hotelRecords.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Assigned room type" hint="Choose the room type that should be assigned for the selected hotel.">
              <select className="select-base" value={draft.roomType} onChange={(event) => setDraft((current) => ({ ...current, roomType: event.target.value }))}>
                <option value="">Select room type</option>
                {(hotelRecords.find((hotel) => hotel._id === draft.hotelId)?.roomTypes ?? []).map((room) => (
                  <option key={room.type} value={room.type}>
                    {room.type}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Room quantity" hint="Enter how many rooms of the selected type are needed for this day.">
              <input className="input-base" type="number" min="1" value={draft.quantity} onChange={(event) => setDraft((current) => ({ ...current, quantity: Number(event.target.value) }))} />
            </AdminField>
            <AdminField label="Places covered" hint="Add one place per line using the format Name | Image URL." className="md:col-span-2">
              <textarea className="textarea-base min-h-32" placeholder="Kaghan | https://...\nNaran | https://..." value={draft.placesCoveredText} onChange={(event) => setDraft((current) => ({ ...current, placesCoveredText: event.target.value }))} />
            </AdminField>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Add itinerary day</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {dayRecords.map((day) => (
          <Card key={day._id} className="border-border/70 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>
                  Day {day.dayNumber}: {day.title}
                </CardTitle>
                <CardDescription>{day.description}</CardDescription>
              </div>
              <Button variant="destructive" size="sm" onClick={async () => removeDay({ dayId: day._id as never })}>
                Delete
              </Button>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Overnight: {day.overnightLocation}
              {day.assignment ? ` | Hotel: ${hotelRecords.find((hotel) => hotel._id === day.assignment?.hotelId)?.name ?? "Assigned"}` : ""}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
