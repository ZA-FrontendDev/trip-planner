import { CalendarDays, CarFront, MapPin, ShieldCheck, Star, Users } from "lucide-react";

import { formatPrice } from "@/lib/format-price";
import type { TripBooking } from "@/lib/mock-data";

type ItineraryViewProps = {
  booking: TripBooking;
};

export function ItineraryView({ booking }: ItineraryViewProps) {
  return (
    <div className="space-y-6">
      <section className="card-surface p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="display-font text-3xl font-semibold text-ink">{booking.title}</h1>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600">
              <MetaItem icon={<MapPin className="h-4 w-4" />} label={booking.departureCity} />
              <MetaItem icon={<CalendarDays className="h-4 w-4" />} label={booking.dateRange} />
              <MetaItem icon={<CalendarDays className="h-4 w-4" />} label={booking.durationLabel} />
              <MetaItem icon={<Users className="h-4 w-4" />} label={booking.travelersLabel} />
              <MetaItem icon={<ShieldCheck className="h-4 w-4" />} label={booking.travelClass} />
              <MetaItem icon={<CarFront className="h-4 w-4" />} label={booking.vehicle} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="pill-button">Edit</button>
              <button className="pill-button">Share</button>
            </div>
          </div>
          <div className="space-y-4 xl:min-w-[360px]">
            <p className="text-right text-sm text-slate-500">
              Trip total for 4 persons{" "}
              <span className="display-font text-2xl font-semibold text-primary">
                {formatPrice(booking.totalPrice)}
              </span>
            </p>
            <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
              <select className="input-base max-w-full sm:max-w-[180px]">
                <option>{booking.vehicle}</option>
                <option>Hiace</option>
                <option>Land Cruiser</option>
              </select>
              <button className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary/90">
                Book
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="display-font text-3xl font-semibold text-ink">Itinerary</h2>
        <div className="mt-6 space-y-5">
          {booking.days.map((day) => (
            <article key={day.dayNumber} className="grid gap-4 lg:grid-cols-[210px_minmax(0,1fr)] lg:items-start">
              <div className="px-2 pt-4 text-sm text-slate-600 lg:text-right">
                <p className="display-font text-xl text-ink">{day.date}</p>
                <p>Day {day.dayNumber}</p>
              </div>

              <div className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-card backdrop-blur">
                <div className="flex gap-4 rounded-[18px] border border-slate-200/70 bg-white px-4 py-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-slate-700">{day.route}</p>
                </div>

                <div className="px-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Places Covered
                  </p>
                  <div className="grid gap-3 xl:grid-cols-4">
                    {day.placesCovered.map((place) => (
                      <div
                        key={place.name}
                        className="overflow-hidden rounded-[18px] border border-slate-200/70 bg-white"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={place.image} alt={place.name} className="h-20 w-full object-cover" />
                        <p className="px-4 py-4 text-sm font-medium text-slate-700">{place.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-[18px] border border-slate-200/70 bg-white px-4 py-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <p className="font-medium text-slate-800">{day.overnightLocation}</p>
                </div>

                <div className="flex flex-col gap-4 rounded-[18px] border border-slate-200/70 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <CarFront className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-800">{day.hotel.name}</p>
                        {day.hotel.verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        ) : null}
                        <div className="flex items-center gap-1 text-accent">
                          {Array.from({ length: day.hotel.stars }).map((_, index) => (
                            <Star key={index} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-slate-500">
                          {formatPrice(day.hotel.pricePerNight)} per Night
                        </span>
                      </div>
                      <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {day.hotel.roomLabel}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="pill-button">Change Rooms</button>
                    <button className="pill-button">Change Hotel</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
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
