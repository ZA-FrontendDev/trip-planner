"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import {
  CalendarDays,
  CarFront,
  ChevronDown,
  Hotel,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import hotelImage from "@/hotel.png";
import roomImage from "@/room.png";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/format-price";
import type {
  BookingItineraryView,
  ItineraryDayView,
  SiteHotel,
} from "@/lib/trip-types";
import { BootstrapData } from "@/components/shared/bootstrap-data";

type DialogState = {
  type: "hotel" | "room";
  day: ItineraryDayView;
} | null;

export function BookingItineraryClient({ bookingId }: { bookingId: string }) {
  const booking = useQuery(api.bookings.getItinerary, {
    bookingId: bookingId as never,
  });
  const changeHotel = useMutation(api.bookings.changeHotel);
  const changeRoom = useMutation(api.bookings.changeRoom);
  const changeVehicle = useMutation(api.bookings.changeVehicle);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>(null);

  const travelerLabel = useMemo(() => {
    if (!booking) return "";
    const total = booking.adults + booking.children;
    return `${total} traveler${total === 1 ? "" : "s"}`;
  }, [booking]);

  if (!booking) {
    return (
      <div className="space-y-6">
        <BootstrapData />
        <div className="card-surface p-8 text-sm text-slate-600">
          Loading booking itinerary...
        </div>
      </div>
    );
  }

  const bookingData = booking as BookingItineraryView;

  return (
    <div className="space-y-6">
      <section className="relative card-surface overflow-hidden p-6">
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(90deg,rgba(13,124,110,0.09),rgba(245,158,11,0.06),transparent)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="display-font text-3xl font-semibold text-ink">
              {bookingData.package.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600">
              <MetaItem
                icon={<MapPin className="h-4 w-4" />}
                label={bookingData.departureCity}
              />
              <MetaItem
                icon={<CalendarDays className="h-4 w-4" />}
                label={`${bookingData.startDate} - ${bookingData.endDate}`}
              />
              <MetaItem
                icon={<CalendarDays className="h-4 w-4" />}
                label={`${bookingData.package.durationDays} Days`}
              />
              <MetaItem
                icon={<Users className="h-4 w-4" />}
                label={travelerLabel}
              />
              <MetaItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label={bookingData.travelClass}
              />
              <MetaItem
                icon={<CarFront className="h-4 w-4" />}
                label={bookingData.vehicle?.name ?? "Vehicle pending"}
              />
            </div>
          </div>
          <div className="space-y-4 xl:min-w-90">
            {bookingData.vehicle?.images?.[0] ? (
              <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
                <div className="relative h-36 w-full">
                  <Image
                    src={bookingData.vehicle.images[0]}
                    alt={bookingData.vehicle.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {bookingData.vehicle.name}
                  </p>
                  <p className="text-xs text-slate-500">Selected vehicle</p>
                </div>
              </div>
            ) : null}
            <p className="text-right text-sm text-slate-500">
              Trip total{" "}
              <span className="display-font text-2xl font-semibold text-primary">
                {formatPrice(bookingData.totalPrice)}
              </span>
            </p>
            <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
              <SelectShell>
                <select
                  className="select-base max-w-full sm:max-w-60"
                  value={bookingData.vehicle?._id ?? ""}
                  onChange={async (event) => {
                    setBusyKey("vehicle");
                    await changeVehicle({
                      bookingId: bookingData._id as never,
                      vehicleId: event.target.value as never,
                    });
                    setBusyKey(null);
                  }}
                >
                  {bookingData.vehicleOptions.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
              </SelectShell>
              <button className="inline-flex h-13 items-center justify-center rounded-[18px] bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary/90">
                Book
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="display-font text-3xl font-semibold text-ink">
              Itinerary
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Day titles, routes, overnight locations, and places covered come
              from the package itinerary stored in Convex. Dates are generated
              from your selected start date.
            </p>
          </div>
        </div>

        {bookingData.images?.length ? (
          <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Booking Media
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {bookingData.images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50"
                >
                  <div className="relative h-28 w-full">
                    <Image
                      src={image}
                      alt={`Booking media ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 space-y-5">
          {bookingData.days.map((day) => {
            const relevantHotels = getRelevantHotels(
              bookingData.hotelOptions,
              day,
            );

            return (
              <article
                key={day._id}
                className="grid gap-4 lg:grid-cols-[210px_minmax(0,1fr)] lg:items-start"
              >
                <div className="px-2 pt-4 text-sm text-slate-600 lg:text-right">
                  <p className="display-font text-xl text-ink">{day.date}</p>
                  <p>Day {day.dayNumber}</p>
                </div>

                <div className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-card backdrop-blur">
                  <div className="flex gap-4 rounded-[18px] border border-slate-200/70 bg-white px-4 py-4">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-900">
                          {day.title}
                        </p>
                        {day.isGenerated ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                            <Sparkles className="size-3.5" />
                            Generated day
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {day.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Places Covered
                    </p>
                    <div className="grid gap-3 xl:grid-cols-4">
                      {day.placesCovered.map((place, index) => (
                        <div
                          key={`${day._id}-${place.name}-${index}`}
                          className="overflow-hidden rounded-[18px] border border-slate-200/70 bg-white"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={place.image}
                            alt={place.name}
                            className="h-20 w-full object-cover"
                          />
                          <p className="px-4 py-4 text-sm font-medium text-slate-700">
                            {place.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-[18px] border border-slate-200/70 bg-white px-4 py-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-slate-800">
                        {day.overnightLocation}
                      </p>
                      <p className="text-xs text-slate-500">Overnight stop</p>
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-slate-200/70 bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <Hotel className="mt-0.5 h-5 w-5 text-primary" />
                        {day.hotel?.images?.[0] ? (
                          <div className="relative h-20 w-28 overflow-hidden rounded-[18px] border border-slate-200">
                            <Image
                              src={day.hotel.images[0]}
                              alt={day.hotel.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : null}
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-slate-800">
                              {day.hotel?.name ?? "Hotel not assigned"}
                            </p>
                            {day.hotel?.isVerified ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Verified
                              </span>
                            ) : null}
                            <div className="flex items-center gap-1 text-accent">
                              {Array.from({
                                length: day.hotel?.stars ?? 0,
                              }).map((_, index) => (
                                <Star
                                  key={index}
                                  className="h-4 w-4 fill-current"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-slate-500">
                            {day.hotel
                              ? `${formatPrice(day.hotel.pricePerNight)} per night`
                              : "Choose a hotel for this stop"}
                          </p>
                          <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {(day.roomType ?? bookingData.roomType) +
                              ` x ${day.roomQuantity}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-2">
                      <ActionCard
                        title="Change Hotel"
                        description="Swap the hotel for this stop from available Convex hotel records."
                        image={hotelImage}
                        buttonLabel="Change Hotel"
                        busy={busyKey === `hotel-${day._id}`}
                        onClick={() => setDialogState({ type: "hotel", day })}
                        disabled={
                          relevantHotels.length === 0 || day.isGenerated
                        }
                      />
                      <ActionCard
                        title="Change Room"
                        description="Select a different room type for the currently assigned hotel."
                        image={roomImage}
                        buttonLabel="Change Room"
                        busy={busyKey === `room-${day._id}`}
                        onClick={() => setDialogState({ type: "room", day })}
                        disabled={!day.hotel || day.isGenerated}
                      />
                    </div>

                    {day.isGenerated ? (
                      <p className="mt-3 text-xs text-amber-700">
                        This day was generated to complete the itinerary. Create
                        a fresh booking after the package itinerary is saved in
                        admin if you want direct day-level customization here.
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {busyKey ? (
        <p className="text-sm text-slate-500">Saving customization...</p>
      ) : null}

      {dialogState ? (
        <CustomizerDialog
          dialogState={dialogState}
          bookingData={bookingData}
          busyKey={busyKey}
          onClose={() => setDialogState(null)}
          onSelectHotel={async (hotel) => {
            setBusyKey(`hotel-${dialogState.day._id}`);
            await changeHotel({
              bookingId: bookingData._id as never,
              dayId: dialogState.day._id as never,
              hotelId: hotel._id as never,
              roomType:
                hotel.roomTypes[0]?.type ??
                dialogState.day.roomType ??
                bookingData.roomType,
            });
            setBusyKey(null);
            setDialogState(null);
          }}
          onSelectRoom={async (roomType) => {
            setBusyKey(`room-${dialogState.day._id}`);
            await changeRoom({
              bookingId: bookingData._id as never,
              dayId: dialogState.day._id as never,
              roomType,
            });
            setBusyKey(null);
            setDialogState(null);
          }}
        />
      ) : null}
    </div>
  );
}

function MetaItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SelectShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function ActionCard({
  title,
  description,
  image,
  buttonLabel,
  busy,
  disabled,
  onClick,
}: {
  title: string;
  description: string;
  image: typeof hotelImage;
  buttonLabel: string;
  busy: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfb_100%)] shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
      <div className="grid gap-4 p-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:items-center">
        <div className="overflow-hidden rounded-[18px] border border-slate-200/70 bg-slate-50">
          <Image src={image} alt={title} className="h-24 w-full object-cover" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onClick}
            disabled={busy || disabled}
          >
            {busy ? "Saving..." : buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomizerDialog({
  dialogState,
  bookingData,
  busyKey,
  onClose,
  onSelectHotel,
  onSelectRoom,
}: {
  dialogState: NonNullable<DialogState>;
  bookingData: BookingItineraryView;
  busyKey: string | null;
  onClose: () => void;
  onSelectHotel: (hotel: SiteHotel) => Promise<void>;
  onSelectRoom: (roomType: string) => Promise<void>;
}) {
  const relevantHotels = getRelevantHotels(
    bookingData.hotelOptions,
    dialogState.day,
  );
  const roomChoices = dialogState.day.hotel?.roomTypes ?? [];
  const isHotelDialog = dialogState.type === "hotel";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.18)]">
        <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="relative min-h-55 bg-slate-100">
            <Image
              src={isHotelDialog ? hotelImage : roomImage}
              alt={isHotelDialog ? "Hotel selection" : "Room selection"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.52))]" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                {isHotelDialog ? "Change Hotel" : "Change Room"}
              </p>
              <h3 className="display-font mt-2 text-2xl font-semibold">
                Day {dialogState.day.dayNumber}: {dialogState.day.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/80">
                {dialogState.day.overnightLocation}
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-600">
                  {isHotelDialog
                    ? "These hotel options come from Convex hotel records and can be updated per itinerary day."
                    : "Room choices come from the currently selected hotel's room types."}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-3 overflow-y-auto pr-1">
              {isHotelDialog
                ? relevantHotels.map((hotel) => (
                    <button
                      key={hotel._id}
                      type="button"
                      className="flex w-full items-start justify-between gap-4 rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-primary"
                      onClick={() => void onSelectHotel(hotel)}
                      disabled={busyKey === `hotel-${dialogState.day._id}`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900">
                            {hotel.name}
                          </p>
                          {hotel.isVerified ? (
                            <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                              Verified
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {hotel.location}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {hotel.roomTypes[0]?.type ?? "Standard room"} included
                          first
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {formatPrice(hotel.pricePerNight)}
                        </p>
                        <p className="text-xs text-slate-500">per night</p>
                      </div>
                    </button>
                  ))
                : roomChoices.map((room) => (
                    <button
                      key={room.type}
                      type="button"
                      className="flex w-full items-start justify-between gap-4 rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-primary"
                      onClick={() => void onSelectRoom(room.type)}
                      disabled={busyKey === `room-${dialogState.day._id}`}
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {room.type}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Capacity: {room.capacity} guests
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {formatPrice(room.pricePerNight)}
                        </p>
                        <p className="text-xs text-slate-500">per night</p>
                      </div>
                    </button>
                  ))}

              {!isHotelDialog && roomChoices.length === 0 ? (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  Select or assign a hotel first before changing the room.
                </div>
              ) : null}

              {isHotelDialog && relevantHotels.length === 0 ? (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  No hotel options are configured for this stop yet.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRelevantHotels(hotels: SiteHotel[], day: ItineraryDayView) {
  const matches = hotels.filter(
    (hotel) =>
      hotel.location
        .toLowerCase()
        .includes(day.overnightLocation.toLowerCase()) ||
      hotel.location.toLowerCase() === day.overnightLocation.toLowerCase(),
  );

  return matches.length > 0 ? matches : hotels;
}
