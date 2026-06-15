"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { CalendarDays, ChevronDown, MapPinned, Sparkles } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { BootstrapData } from "@/components/shared/bootstrap-data";
import type { TravelClass } from "@/lib/trip-options";
import { DEPARTURE_CITIES, DESTINATIONS, ROOM_TYPES, TRAVEL_CLASSES, VEHICLE_TYPES } from "@/lib/trip-options";

type DesignTripFormState = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  departureCity: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  roomType: string;
  travelClass: TravelClass;
  vehicleType: string;
  specialRequests: string;
};

export function DesignTripClient() {
  const router = useRouter();
  const createBooking = useMutation(api.bookings.create);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [form, setForm] = useState<DesignTripFormState>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    departureCity: DEPARTURE_CITIES[0],
    destination: DESTINATIONS[0],
    startDate: "",
    endDate: "",
    adults: 4,
    children: 0,
    roomType: ROOM_TYPES[0],
    travelClass: TRAVEL_CLASSES[0],
    vehicleType: VEHICLE_TYPES[0],
    specialRequests: ""
  });

  const durationLabel = useMemo(() => {
    if (!form.startDate || !form.endDate) {
      return "Select travel dates";
    }
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${Math.max(days, 1)} days`;
  }, [form.endDate, form.startDate]);

  return (
    <div className="space-y-6">
      <BootstrapData />
      <div className="card-surface relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(13,124,110,0.08),rgba(245,158,11,0.06),transparent)]" />

        <div className="relative mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Design My Trip</p>
          <h2 className="display-font mt-3 text-3xl font-semibold text-ink">Trip configuration</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Enter your trip details below. We will match your selection with an active package and then open the editable itinerary.
          </p>
        </div>

        <form
          className="relative"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            setDialogMessage(null);
            setIsSubmitting(true);
            try {
              const bookingId = await createBooking(form);
              router.push(`/design-trip/${bookingId}`);
            } catch (submitError) {
              const message =
                submitError instanceof Error ? submitError.message : "Unable to create booking.";
              const normalizedMessage = message.includes("No active package matches the selected trip criteria yet.")
                ? "No package matches your selected trip criteria yet."
                : "Unable to create your itinerary right now. Please try again.";
              setError(normalizedMessage);
              setDialogMessage(normalizedMessage);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Full name" hint="Enter the lead traveler's full name.">
              <input
                className="input-base"
                placeholder="e.g. Ali Khan"
                value={form.customerName}
                onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
                required
              />
            </Field>

            <Field label="Email address" hint="We will use this for itinerary details and booking updates.">
              <input
                className="input-base"
                type="email"
                placeholder="e.g. ali@example.com"
                value={form.customerEmail}
                onChange={(event) => setForm((current) => ({ ...current, customerEmail: event.target.value }))}
                required
              />
            </Field>

            <Field label="Phone / WhatsApp number" hint="Use a number where we can quickly contact you.">
              <input
                className="input-base"
                placeholder="e.g. +92 300 1234567"
                value={form.customerPhone}
                onChange={(event) => setForm((current) => ({ ...current, customerPhone: event.target.value }))}
                required
              />
            </Field>

            <Field label="Departure city" hint="Choose the city where your trip will begin.">
              <SelectShell icon={<MapPinned className="size-4 text-primary" />}>
                <select
                  className="select-base"
                  value={form.departureCity}
                  onChange={(event) => setForm((current) => ({ ...current, departureCity: event.target.value }))}
                >
                  {DEPARTURE_CITIES.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </SelectShell>
            </Field>

            <Field label="Destination" hint="Select the main destination you want to visit.">
              <SelectShell icon={<Sparkles className="size-4 text-primary" />}>
                <select
                  className="select-base"
                  value={form.destination}
                  onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))}
                >
                  {DESTINATIONS.map((destination) => (
                    <option key={destination}>{destination}</option>
                  ))}
                </select>
              </SelectShell>
            </Field>

            <div className="rounded-[24px] border border-emerald-100 bg-[linear-gradient(135deg,rgba(13,124,110,0.08),rgba(255,255,255,0.9))] px-5 py-4 text-sm text-slate-600 shadow-[0_18px_40px_rgba(13,124,110,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                  <CalendarDays className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Trip duration</p>
                  <p className="mt-1 font-semibold text-slate-900">{durationLabel}</p>
                </div>
              </div>
            </div>

            <Field label="Trip start date" hint="Choose the day you want to start traveling.">
              <DateShell>
                <input
                  className="date-base"
                  type="date"
                  value={form.startDate}
                  onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                  required
                />
              </DateShell>
            </Field>

            <Field label="Trip end date" hint="Choose the day your trip should end.">
              <DateShell>
                <input
                  className="date-base"
                  type="date"
                  value={form.endDate}
                  onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                  required
                />
              </DateShell>
            </Field>

            <Field label="Number of adults" hint="Enter the total number of adult travelers.">
              <input
                className="input-base"
                type="number"
                min="1"
                value={form.adults}
                onChange={(event) => setForm((current) => ({ ...current, adults: Number(event.target.value) }))}
                required
              />
            </Field>

            <Field label="Number of children" hint="Enter the total number of child travelers.">
              <input
                className="input-base"
                type="number"
                min="0"
                value={form.children}
                onChange={(event) => setForm((current) => ({ ...current, children: Number(event.target.value) }))}
                required
              />
            </Field>

            <Field label="Preferred room type" hint="Choose the accommodation style you prefer.">
              <SelectShell>
                <select
                  className="select-base"
                  value={form.roomType}
                  onChange={(event) => setForm((current) => ({ ...current, roomType: event.target.value }))}
                >
                  {ROOM_TYPES.map((room) => (
                    <option key={room}>{room}</option>
                  ))}
                </select>
              </SelectShell>
            </Field>

            <Field label="Travel class" hint="Choose the package class you want for this trip.">
              <SelectShell>
                <select
                  className="select-base capitalize"
                  value={form.travelClass}
                  onChange={(event) => setForm((current) => ({ ...current, travelClass: event.target.value as TravelClass }))}
                >
                  {TRAVEL_CLASSES.map((travelClass) => (
                    <option key={travelClass} value={travelClass}>
                      {travelClass}
                    </option>
                  ))}
                </select>
              </SelectShell>
            </Field>

            <Field label="Preferred vehicle" hint="Select the vehicle you want if a matching package is available.">
              <SelectShell>
                <select
                  className="select-base"
                  value={form.vehicleType}
                  onChange={(event) => setForm((current) => ({ ...current, vehicleType: event.target.value }))}
                >
                  {VEHICLE_TYPES.map((vehicle) => (
                    <option key={vehicle}>{vehicle}</option>
                  ))}
                </select>
              </SelectShell>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Special requests" hint="Add dietary notes, accessibility needs, custom stopovers, or other travel requirements.">
              <textarea
                className="textarea-base min-h-32"
                placeholder="Write any special requirements here"
                value={form.specialRequests}
                onChange={(event) => setForm((current) => ({ ...current, specialRequests: event.target.value }))}
              />
            </Field>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-[24px] bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className={`text-sm ${error ? "text-rose-600" : "text-slate-600"}`}>
              {error ? error : "We will create the booking, match a package, and redirect you to the editable itinerary."}
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating booking..." : "Create itinerary"}
            </button>
          </div>
        </form>
      </div>

      {dialogMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Trip not available</p>
            <h3 className="display-font mt-3 text-2xl font-semibold text-ink">No matching package found</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{dialogMessage}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                onClick={() => setDialogMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <div className="space-y-1">
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        <span className="block text-xs leading-5 text-slate-500">{hint}</span>
      </div>
      {children}
    </label>
  );
}

function SelectShell({
  children,
  icon
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon ? <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2">{icon}</div> : null}
      <div className={icon ? "[&_select]:pl-11" : ""}>{children}</div>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function DateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <CalendarDays className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
