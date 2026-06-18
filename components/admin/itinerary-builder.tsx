"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { CalendarDays, ImageIcon, MapPinned, Mountain, Plus, Trash2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import type { SiteHotel } from "@/lib/trip-types";
import { AdminField } from "@/components/admin/admin-field";
import { AdminImageUploader } from "@/components/admin/admin-image-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PlaceDraft = {
  name: string;
  image: string;
};

type DayDraft = {
  key: string;
  dayId: string | null;
  dayNumber: number;
  date: string;
  title: string;
  description: string;
  startDestination: string;
  endDestination: string;
  overnightLocation: string;
  hotelId: string;
  roomType: string;
  quantity: number;
  placesCovered: PlaceDraft[];
  isExtra: boolean;
};

export function ItineraryBuilder({ packageId }: { packageId: string }) {
  const packageRecord = useQuery(api.packages.getById, { packageId: packageId as never });
  const days = useQuery(api.itinerary.getForPackage, { packageId: packageId as never });
  const hotels = useQuery(api.hotels.list);
  const saveDay = useMutation(api.itinerary.saveDay);
  const removeDay = useMutation(api.itinerary.removeDay);

  const hotelRecords = (hotels ?? []) as SiteHotel[];
  const [dayForms, setDayForms] = useState<DayDraft[]>([]);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!days) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- query results intentionally hydrate local editable drafts
    setDayForms(
      days.map((day: any) => ({
        key: day._id ?? `draft-${day.dayNumber}`,
        dayId: (day._id as string | null) ?? null,
        dayNumber: day.dayNumber,
        date: day.date ?? "",
        title: day.title ?? "",
        description: day.description ?? "",
        startDestination: day.startDestination ?? "",
        endDestination: day.endDestination ?? "",
        overnightLocation: day.overnightLocation ?? "",
        hotelId: (day.assignment?.hotelId as string | undefined) ?? "",
        roomType: day.assignment?.roomType ?? "",
        quantity: day.assignment?.quantity ?? 1,
        placesCovered:
          day.placesCovered?.length > 0
            ? day.placesCovered.map((place: any) => ({
                name: place.name,
                image: place.image,
              }))
            : [{ name: "", image: "" }],
        isExtra: Boolean(day.isExtra),
      })),
    );
  }, [days]);

  const coverageSummary = useMemo(() => {
    const names = new Set<string>();

    dayForms.forEach((day) => {
      day.placesCovered.forEach((place) => {
        if (place.name.trim()) {
          names.add(place.name.trim());
        }
      });
    });

    return Array.from(names);
  }, [dayForms]);

  if (!packageRecord) {
    return <Card className="border-border/70 bg-white p-8 shadow-sm">Loading itinerary workspace...</Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200/80 bg-[linear-gradient(135deg,#f8fcfb_0%,#eef8f6_100%)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <CardTitle className="display-font text-3xl">Day-wise itinerary builder</CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-sm leading-6">
                Build every itinerary day for this package. Add each covered place with its own real image,
                assign the included hotel and room type, and control exactly what the traveler sees after booking.
              </CardDescription>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryChip icon={<CalendarDays className="size-4" />} label="Days" value={String(packageRecord.durationDays)} />
              <SummaryChip icon={<MapPinned className="size-4" />} label="Covered places" value={String(coverageSummary.length)} />
              <SummaryChip icon={<Mountain className="size-4" />} label="Destination" value={packageRecord.destination} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            Upload the actual image for each place whenever possible. If a place image is left empty, the system
            will try a mapped fallback image, but admin-uploaded place images take priority on the frontend.
          </div>
          {statusMessage ? <p className="mt-4 text-sm text-emerald-700">{statusMessage}</p> : null}
        </CardContent>
      </Card>

      <div className="space-y-5">
        {dayForms.map((day, dayIndex) => {
          const orderedHotels = getOrderedHotels(hotelRecords, day.overnightLocation, packageRecord.destination);
          const selectedHotel = hotelRecords.find((hotel) => hotel._id === day.hotelId);

          return (
            <Card key={day.key} className="overflow-hidden border-border/70 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-200/80 bg-slate-50/70">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <CardTitle className="display-font text-2xl">Day {day.dayNumber}</CardTitle>
                    <CardDescription className="mt-2 text-sm leading-6">
                      Define the route, covered places, hotel, and room details for this day.
                    </CardDescription>
                  </div>
                  <div className="flex gap-3">
                    {day.isExtra ? (
                      <div className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        Outside current duration
                      </div>
                    ) : null}
                    {day.dayId ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          setBusyKey(`delete-${day.key}`);
                          setStatusMessage(null);
                          await removeDay({ dayId: day.dayId as never });
                          setBusyKey(null);
                          setStatusMessage(`Day ${day.dayNumber} removed from the package itinerary.`);
                        }}
                        disabled={busyKey === `delete-${day.key}`}
                      >
                        {busyKey === `delete-${day.key}` ? "Deleting..." : "Delete day"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <AdminField label="Day date" hint="Calendar date label shown for this itinerary day.">
                    <input
                      className="date-base"
                      type="date"
                      value={day.date}
                      onChange={(event) => updateDay(setDayForms, dayIndex, { date: event.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Starting destination" hint="Where this day starts from. This is shown in the route line on the frontend.">
                    <input
                      className="input-base"
                      placeholder="e.g. Islamabad"
                      value={day.startDestination}
                      onChange={(event) =>
                        updateDay(setDayForms, dayIndex, {
                          startDestination: event.target.value,
                        })
                      }
                    />
                  </AdminField>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <AdminField label="Ending destination" hint="Final destination reached on this day before overnight stay.">
                    <input
                      className="input-base"
                      placeholder="e.g. Naran"
                      value={day.endDestination}
                      onChange={(event) =>
                        updateDay(setDayForms, dayIndex, {
                          endDestination: event.target.value,
                          overnightLocation: currentNeedsOvernightSync(day.overnightLocation, day.endDestination)
                            ? event.target.value
                            : day.overnightLocation,
                        })
                      }
                    />
                  </AdminField>
                  <AdminField label="Overnight location" hint="Where the traveler stays at the end of this day.">
                    <input
                      className="input-base"
                      placeholder="e.g. Hunza"
                      value={day.overnightLocation}
                      onChange={(event) =>
                        updateDay(setDayForms, dayIndex, {
                          overnightLocation: event.target.value,
                        })
                      }
                    />
                  </AdminField>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <AdminField label="Day title" hint="Short headline like Arrival Day, Valley Transfer, or Free Exploration Day.">
                    <input
                      className="input-base"
                      placeholder="e.g. Arrival and transfer to Hunza"
                      value={day.title}
                      onChange={(event) => updateDay(setDayForms, dayIndex, { title: event.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Included hotel" hint="Hotel assigned to this day for the package.">
                    <select
                      className="select-base"
                      value={day.hotelId}
                      onChange={(event) => {
                        const nextHotel = hotelRecords.find((hotel) => hotel._id === event.target.value);
                        updateDay(setDayForms, dayIndex, {
                          hotelId: event.target.value,
                          roomType: nextHotel?.roomTypes[0]?.type ?? "",
                        });
                      }}
                    >
                      <option value="">No hotel assignment</option>
                      {orderedHotels.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name} ({hotel.location})
                        </option>
                      ))}
                    </select>
                  </AdminField>
                </div>

                <AdminField label="Route description" hint="Detailed public description of activities, stops, and route progression.">
                  <textarea
                    className="textarea-base min-h-28"
                    placeholder="Departure, stopovers, planned sightseeing, arrival details..."
                    value={day.description}
                    onChange={(event) => updateDay(setDayForms, dayIndex, { description: event.target.value })}
                  />
                </AdminField>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <AdminField label="Selected room type" hint="Room type included for the selected hotel on this day.">
                    <select
                      className="select-base"
                      value={day.roomType}
                      onChange={(event) => updateDay(setDayForms, dayIndex, { roomType: event.target.value })}
                    >
                      <option value="">Select room type</option>
                      {(selectedHotel?.roomTypes ?? []).map((room) => (
                        <option key={room.type} value={room.type}>
                          {room.type}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                  <AdminField label="Room quantity" hint="How many rooms of the selected type are included for this day.">
                    <input
                      className="input-base"
                      type="number"
                      min="1"
                      value={day.quantity}
                      onChange={(event) => updateDay(setDayForms, dayIndex, { quantity: Number(event.target.value) || 1 })}
                    />
                  </AdminField>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Package matching note</p>
                    <p className="mt-2 leading-6">
                      This package currently matches <span className="font-semibold">{packageRecord.departureCity}</span> to{" "}
                      <span className="font-semibold">{packageRecord.destination}</span> for{" "}
                      <span className="font-semibold">{packageRecord.durationDays}</span> days.
                    </p>
                    <p className="mt-3 leading-6">
                      Public route line for this day will display{" "}
                      <span className="font-semibold">
                        {day.startDestination || "Start"} to {day.endDestination || "End"}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfb_100%)] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="display-font text-xl font-semibold text-slate-900">Places Covered</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Add every place visited on this day and upload the exact image that should appear on the frontend.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        appendPlace(setDayForms, dayIndex, {
                          name: "",
                          image: "",
                        })
                      }
                    >
                      <Plus className="mr-2 size-4" />
                      Add place
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {day.placesCovered.map((place, placeIndex) => (
                      <div
                        key={`${day.key}-place-${placeIndex}`}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">Place {placeIndex + 1}</p>
                          <button
                            type="button"
                            className="rounded-full p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                            onClick={() => removePlace(setDayForms, dayIndex, placeIndex)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                          <AdminField label="Place name" hint="Exact place name shown in the ‘Places Covered’ section.">
                            <input
                              className="input-base"
                              placeholder="e.g. Attabad Lake"
                              value={place.name}
                              onChange={(event) =>
                                updatePlace(setDayForms, dayIndex, placeIndex, {
                                  name: event.target.value,
                                })
                              }
                            />
                          </AdminField>

                          <AdminImageUploader
                            label="Place image"
                            hint="Upload the real image for this specific place."
                            category="place"
                            images={place.image ? [place.image] : []}
                            onChange={(images) =>
                              updatePlace(setDayForms, dayIndex, placeIndex, {
                                image: images[0] ?? "",
                              })
                            }
                          />
                        </div>

                        {!place.image ? (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-600">
                            <ImageIcon className="size-3.5" />
                            Uploading a place image is recommended so the frontend shows the real place instead of a fallback.
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={async () => {
                      setBusyKey(`save-${day.key}`);
                      setStatusMessage(null);

                      await saveDay({
                        dayId: day.dayId ? (day.dayId as never) : undefined,
                        packageId: packageId as never,
                        dayNumber: day.dayNumber,
                        date: day.date,
                        title: day.title,
                        description: day.description,
                        startDestination: day.startDestination,
                        endDestination: day.endDestination,
                        overnightLocation: day.overnightLocation,
                        placesCovered: day.placesCovered
                          .filter((place) => place.name.trim())
                          .map((place) => ({
                            name: place.name.trim(),
                            image: place.image,
                          })),
                        hotelId: day.hotelId ? (day.hotelId as never) : undefined,
                        roomType: day.roomType || undefined,
                        quantity: day.quantity,
                      });

                      setBusyKey(null);
                      setStatusMessage(`Day ${day.dayNumber} itinerary saved successfully.`);
                    }}
                    disabled={busyKey === `save-${day.key}`}
                  >
                    {busyKey === `save-${day.key}` ? "Saving day..." : `Save Day ${day.dayNumber}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function updateDay(
  setDayForms: Dispatch<SetStateAction<DayDraft[]>>,
  dayIndex: number,
  patch: Partial<DayDraft>,
) {
  setDayForms((current) =>
    current.map((day, index) => (index === dayIndex ? { ...day, ...patch } : day)),
  );
}

function updatePlace(
  setDayForms: Dispatch<SetStateAction<DayDraft[]>>,
  dayIndex: number,
  placeIndex: number,
  patch: Partial<PlaceDraft>,
) {
  setDayForms((current) =>
    current.map((day, index) => {
      if (index !== dayIndex) {
        return day;
      }

      return {
        ...day,
        placesCovered: day.placesCovered.map((place, currentPlaceIndex) =>
          currentPlaceIndex === placeIndex ? { ...place, ...patch } : place,
        ),
      };
    }),
  );
}

function appendPlace(
  setDayForms: Dispatch<SetStateAction<DayDraft[]>>,
  dayIndex: number,
  nextPlace: PlaceDraft,
) {
  setDayForms((current) =>
    current.map((day, index) =>
      index === dayIndex
        ? {
            ...day,
            placesCovered: [...day.placesCovered, nextPlace],
          }
        : day,
    ),
  );
}

function removePlace(
  setDayForms: Dispatch<SetStateAction<DayDraft[]>>,
  dayIndex: number,
  placeIndex: number,
) {
  setDayForms((current) =>
    current.map((day, index) => {
      if (index !== dayIndex) {
        return day;
      }

      const nextPlaces = day.placesCovered.filter((_, currentPlaceIndex) => currentPlaceIndex !== placeIndex);
      return {
        ...day,
        placesCovered: nextPlaces.length > 0 ? nextPlaces : [{ name: "", image: "" }],
      };
    }),
  );
}

function getOrderedHotels(hotels: SiteHotel[], overnightLocation: string, packageDestination: string) {
  const normalizedOvernight = overnightLocation.trim().toLowerCase();
  const normalizedDestination = packageDestination.trim().toLowerCase();

  const exact = hotels.filter((hotel) => hotel.location.trim().toLowerCase() === normalizedOvernight);
  const nearDestination = hotels.filter(
    (hotel) =>
      hotel.location.trim().toLowerCase() === normalizedDestination &&
      !exact.some((exactHotel) => exactHotel._id === hotel._id),
  );
  const others = hotels.filter(
    (hotel) =>
      !exact.some((exactHotel) => exactHotel._id === hotel._id) &&
      !nearDestination.some((destinationHotel) => destinationHotel._id === hotel._id),
  );

  return [...exact, ...nearDestination, ...others];
}

function currentNeedsOvernightSync(currentOvernight: string, currentEndDestination: string) {
  return !currentOvernight || currentOvernight === currentEndDestination;
}

function SummaryChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
