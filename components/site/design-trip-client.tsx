"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";

import { api } from "@/convex/_generated/api";
import { BootstrapData } from "@/components/shared/bootstrap-data";
import type { TravelClass } from "@/lib/trip-options";
import {
  DEPARTURE_CITIES,
  DESTINATIONS,
  ROOM_TYPES,
  TRAVEL_CLASSES,
  VEHICLE_TYPES,
} from "@/lib/trip-options";

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

type SuggestedPackage = {
  packageId: string;
  destination: string;
  departureCity: string;
  durationDays: number;
  title: string;
  coverImage: string;
  basePrice: number;
  travelClass: string;
};

export function DesignTripClient() {
  const router = useRouter();
  const convex = useConvex();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedPackage[]>([]);
  const [step, setStep] = useState(1);
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
    specialRequests: "",
  });

  const durationLabel = useMemo(() => {
    if (!form.startDate || !form.endDate) {
      return "Select travel dates";
    }
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${Math.max(days, 1)} days`;
  }, [form.endDate, form.startDate]);

  const totalTravelers = form.adults + form.children;

  return (
    <div className="bg-slate-100">
      <BootstrapData silent />

      <section className="overflow-hidden bg-[linear-gradient(135deg,#0a2e2b_0%,#0D7C6E_100%)] px-[5%] py-14 text-center">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-amber-400">
          Step-by-Step Planner
        </p>
        <h1 className="display-font text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.8px] text-white">
          Design Your Perfect Trip
        </h1>
        <p className="mt-2 text-[15px] text-white/65">
          Fill in your details and we&apos;ll build a complete itinerary for
          you.
        </p>
      </section>

      <section className="border-b border-slate-200 bg-white px-[5%]">
        <div className="mx-auto flex max-w-225 items-center">
          {[
            [1, "Personal Info"],
            [2, "Trip Details"],
            [3, "Preferences"],
          ].map(([itemStep, label], index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(itemStep as number)}
              className="relative flex flex-1 items-center gap-2.5 py-4.5 text-left"
            >
              <span
                className={`display-font flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  step === itemStep || step > (itemStep as number)
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {itemStep}
              </span>
              <span
                className={`text-[13px] font-semibold ${step === itemStep ? "text-primary" : "text-slate-500"}`}
              >
                {label}
              </span>
              {index < 2 ? (
                <span className="pointer-events-none absolute left-32.5 right-0 top-1/2 h-px bg-slate-200" />
              ) : null}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-275 gap-7 px-[5%] py-10 lg:grid-cols-[1fr_320px]">
        <div>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setDialogMessage(null);
              setSuggestions([]);
              setIsSubmitting(true);
              try {
                const preview = await convex.query(api.bookings.previewItinerary, form);
                if (!preview) {
                  const hints = await convex.query(api.bookings.getAvailabilityHints, {
                    destination: form.destination,
                    departureCity: form.departureCity,
                    startDate: form.startDate,
                    endDate: form.endDate,
                    adults: form.adults,
                    children: form.children,
                    travelClass: form.travelClass,
                  });
                  const nextSuggestions = dedupeSuggestions([
                    ...hints.exactRouteAlternatives,
                    ...hints.sameDestinationAlternatives,
                    ...hints.sameDepartureAlternatives,
                    ...hints.fallbackAlternatives,
                  ]).slice(0, 3);
                  const availabilityMessage =
                    nextSuggestions.length > 0
                      ? `No exact package matched ${form.departureCity} to ${form.destination} for ${getDurationDays(form.startDate, form.endDate)} days. These available packages are the closest options.`
                      : "No package matches your selected trip criteria yet.";
                  setError(availabilityMessage);
                  setDialogMessage(availabilityMessage);
                  setSuggestions(nextSuggestions);
                  return;
                }

                const params = new URLSearchParams({
                  customerName: form.customerName,
                  customerEmail: form.customerEmail,
                  customerPhone: form.customerPhone,
                  departureCity: form.departureCity,
                  destination: form.destination,
                  startDate: form.startDate,
                  endDate: form.endDate,
                  adults: String(form.adults),
                  children: String(form.children),
                  roomType: form.roomType,
                  travelClass: form.travelClass,
                  vehicleType: form.vehicleType,
                  specialRequests: form.specialRequests,
                });
                router.push(`/design-trip/preview?${params.toString()}`);
              } catch (submitError) {
                const message =
                  submitError instanceof Error
                    ? submitError.message
                    : "Unable to create itinerary preview.";
                const normalizedMessage = message.includes(
                  "No active package matches the selected trip criteria yet.",
                )
                  ? "No package matches your selected trip criteria yet."
                  : "Unable to create your itinerary right now. Please try again.";
                setError(normalizedMessage);
                setDialogMessage(normalizedMessage);
                setSuggestions([]);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {step === 1 ? (
              <FormCard
                title="Personal Information"
                sub="Tell us about yourself so we can personalise your trip."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Full Name *">
                    <input
                      className="input-base bg-slate-50 focus:bg-white"
                      placeholder="Ahmed Khan"
                      value={form.customerName}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          customerName: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                  <Field label="Email Address *">
                    <input
                      className="input-base bg-slate-50 focus:bg-white"
                      type="email"
                      placeholder="ahmed@email.com"
                      value={form.customerEmail}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          customerEmail: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Phone / WhatsApp *">
                    <input
                      className="input-base bg-slate-50 focus:bg-white"
                      placeholder="+92 300 0000000"
                      value={form.customerPhone}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          customerPhone: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                  <Field label="Departure City *">
                    <select
                      className="select-base bg-slate-50 focus:bg-white"
                      value={form.departureCity}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          departureCity: event.target.value,
                        }))
                      }
                    >
                      {DEPARTURE_CITIES.map((city) => (
                        <option key={city}>{city}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Number of Adults *">
                    <select
                      className="select-base bg-slate-50 focus:bg-white"
                      value={String(form.adults)}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          adults: Number(event.target.value),
                        }))
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                        <option key={count} value={count}>
                          {count} Adult{count > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Number of Children">
                    <select
                      className="select-base bg-slate-50 focus:bg-white"
                      value={String(form.children)}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          children: Number(event.target.value),
                        }))
                      }
                    >
                      {[0, 1, 2, 3, 4, 5].map((count) => (
                        <option key={count} value={count}>
                          {count === 0
                            ? "No Children"
                            : `${count} Child${count > 1 ? "ren" : ""}`}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mt-5">
                  <Field label="Special Requests">
                    <input
                      className="input-base bg-slate-50 focus:bg-white"
                      placeholder="Dietary, medical, accessibility, etc."
                      value={form.specialRequests}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          specialRequests: event.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>

                <FormNav hint="Step 1 of 3">
                  <button
                    type="button"
                    className="display-font rounded-[10px] bg-primary px-8 py-3 text-sm font-bold text-white transition hover:bg-[#085041]"
                    onClick={() => setStep(2)}
                  >
                    Continue →
                  </button>
                </FormNav>
              </FormCard>
            ) : null}

            {step === 2 ? (
              <FormCard
                title="Trip Details"
                sub="Where are you heading and when?"
              >
                <Field label="Destination *">
                  <select
                    className="select-base bg-slate-50 focus:bg-white"
                    value={form.destination}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        destination: event.target.value,
                      }))
                    }
                  >
                    {DESTINATIONS.map((destination) => (
                      <option key={destination}>{destination}</option>
                    ))}
                  </select>
                </Field>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Departure Date *">
                    <input
                      className="date-base bg-slate-50 focus:bg-white"
                      type="date"
                      value={form.startDate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          startDate: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                  <Field label="Return Date *">
                    <input
                      className="date-base bg-slate-50 focus:bg-white"
                      type="date"
                      value={form.endDate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          endDate: event.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                </div>

                <div className="mt-6">
                  <p className="mb-4 text-xs font-semibold tracking-[0.2px] text-slate-900">
                    Travel Class *
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {[
                      [
                        "economy",
                        "🚗",
                        "Economy",
                        "Standard hotels & vehicles",
                      ],
                      [
                        "business",
                        "✨",
                        "Business",
                        "3–4 star hotels, premium cars",
                      ],
                    ].map(([value, icon, title, sub]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            travelClass: value as TravelClass,
                          }))
                        }
                        className={`rounded-xl border-2 p-4 text-center transition ${
                          form.travelClass === value
                            ? "border-primary bg-emerald-50"
                            : "border-slate-200 hover:border-primary hover:bg-emerald-50"
                        }`}
                      >
                        <div className="mb-2 text-2xl">{icon}</div>
                        <div className="display-font text-[13px] font-semibold text-slate-900">
                          {title}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">
                          {sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <FormNav hint="Step 2 of 3" back={() => setStep(1)}>
                  <button
                    type="button"
                    className="display-font rounded-[10px] bg-primary px-8 py-3 text-sm font-bold text-white transition hover:bg-[#085041]"
                    onClick={() => setStep(3)}
                  >
                    Continue →
                  </button>
                </FormNav>
              </FormCard>
            ) : null}

            {step === 3 ? (
              <FormCard
                title="Choose Your Preferences"
                sub="Set room and vehicle preferences before we build the itinerary."
              >
                <div>
                  <p className="mb-4 text-xs font-semibold tracking-[0.2px] text-slate-900">
                    Room Type *
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {ROOM_TYPES.map((roomType) => (
                      <button
                        key={roomType}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({ ...current, roomType }))
                        }
                        className={`rounded-xl border-2 p-4 text-center transition ${
                          form.roomType === roomType
                            ? "border-primary bg-emerald-50"
                            : "border-slate-200 hover:border-primary hover:bg-emerald-50"
                        }`}
                      >
                        <div className="mb-2 text-2xl">
                          {roomType.includes("Double")
                            ? "🌟"
                            : roomType.includes("Deluxe")
                              ? "🏨"
                              : "🛏️"}
                        </div>
                        <div className="display-font text-[13px] font-semibold text-slate-900">
                          {roomType}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="mb-4 text-xs font-semibold tracking-[0.2px] text-slate-900">
                    Preferred Vehicle *
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {VEHICLE_TYPES.map((vehicle) => (
                      <button
                        key={vehicle}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            vehicleType: vehicle,
                          }))
                        }
                        className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition ${
                          form.vehicleType === vehicle
                            ? "border-primary bg-emerald-50"
                            : "border-slate-200 hover:border-primary"
                        }`}
                      >
                        <div className="flex h-13.5 w-20 flex-none items-center justify-center rounded-lg bg-slate-100 text-2xl">
                          {vehicle.includes("Cruiser")
                            ? "🚙"
                            : vehicle.includes("Hiace") ||
                                vehicle.includes("Coaster")
                              ? "🚌"
                              : "🚗"}
                        </div>
                        <div>
                          <div className="display-font text-[14px] font-semibold text-slate-900">
                            {vehicle}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {vehicle.includes("BRV")
                              ? "7 seats · Sedan SUV"
                              : vehicle.includes("Hiace")
                                ? "10–14 seats · Van"
                                : vehicle.includes("Coaster")
                                  ? "Large group transport"
                                  : "Premium 4×4 travel"}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {error
                    ? error
                    : "Create Itinerary now opens a trip preview first. The booking is only created after the traveler clicks Book on the itinerary page."}
                </div>

                <FormNav hint="Step 3 of 3" back={() => setStep(2)}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="display-font rounded-[10px] bg-amber-500 px-8 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#E08B06] disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Creating itinerary..."
                      : "Create Itinerary →"}
                  </button>
                </FormNav>
              </FormCard>
            ) : null}
          </form>
        </div>

        <aside className="h-fit rounded-[20px] border border-slate-200 bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)] lg:sticky lg:top-22">
          <h2 className="display-font mb-5 text-base font-bold text-slate-900">
            📋 Trip Summary
          </h2>
          <SummaryRow
            label="Traveler"
            value={form.customerName || "Not provided"}
          />
          <SummaryRow label="Departure" value={form.departureCity} />
          <SummaryRow label="Destination" value={form.destination} />
          <SummaryRow
            label="Dates"
            value={
              form.startDate && form.endDate
                ? `${form.startDate} → ${form.endDate}`
                : "Not selected"
            }
          />
          <SummaryRow label="Travelers" value={`${totalTravelers} total`} />
          <SummaryRow label="Class" value={form.travelClass} />
          <SummaryRow label="Room Type" value={form.roomType} />
          <SummaryRow label="Vehicle" value={form.vehicleType} />
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-emerald-900">
                Estimated duration
              </span>
              <span className="display-font text-[22px] font-bold text-primary">
                {durationLabel}
              </span>
            </div>
          </div>
        </aside>
      </section>

      {dialogMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Trip not available
            </p>
            <h3 className="display-font mt-3 text-2xl font-semibold text-ink">
              No matching package found
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {dialogMessage}
            </p>
            {suggestions.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.packageId}
                    type="button"
                    className="overflow-hidden rounded-[22px] border border-slate-200 bg-white text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                    onClick={() =>
                      router.push(
                        buildSuggestedPreviewUrl(form, suggestion),
                      )
                    }
                  >
                    <div className="h-36 w-full overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={suggestion.coverImage}
                        alt={suggestion.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-3 p-4">
                      <div>
                        <p className="display-font text-lg font-semibold text-slate-900">
                          {suggestion.destination}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {suggestion.departureCity} to {suggestion.destination}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-900">
                          {suggestion.durationDays} day{suggestion.durationDays === 1 ? "" : "s"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                          {suggestion.travelClass}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] text-slate-500">Package total</p>
                          <p className="display-font text-lg font-bold text-primary">
                            PKR {suggestion.basePrice.toLocaleString("en-PK")}
                          </p>
                        </div>
                        <span className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white">
                          View Details
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                onClick={() => {
                  setDialogMessage(null);
                  setSuggestions([]);
                }}
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

function FormCard({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
      <h2 className="display-font text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{sub}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold text-slate-900">{label}</span>
      {children}
    </label>
  );
}

function FormNav({
  hint,
  back,
  children,
}: {
  hint: string;
  back?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
      <div className="flex items-center gap-4">
        {back ? (
          <button
            type="button"
            onClick={back}
            className="display-font rounded-[10px] border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
          >
            ← Back
          </button>
        ) : (
          <span className="text-xs text-slate-500">{hint}</span>
        )}
        {back ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-2.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-[13px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function getDurationDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.max(
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    1,
  );
}

function buildSuggestedPreviewUrl(
  form: DesignTripFormState,
  suggestion: SuggestedPackage,
) {
  const start = new Date(form.startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + suggestion.durationDays - 1);

  const params = new URLSearchParams({
    packageId: suggestion.packageId,
    customerName: form.customerName,
    customerEmail: form.customerEmail,
    customerPhone: form.customerPhone,
    departureCity: suggestion.departureCity,
    destination: suggestion.destination,
    startDate: form.startDate,
    endDate: end.toISOString().slice(0, 10),
    adults: String(form.adults),
    children: String(form.children),
    roomType: form.roomType,
    travelClass: suggestion.travelClass,
    vehicleType: "",
    specialRequests: form.specialRequests,
  });

  return `/design-trip/preview?${params.toString()}`;
}

function dedupeSuggestions(items: SuggestedPackage[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.packageId)) {
      return false;
    }
    seen.add(item.packageId);
    return true;
  });
}
