import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="section-shell pt-8">
      <div className="relative overflow-hidden rounded-[36px] bg-ink px-6 py-16 text-white shadow-soft sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,124,110,0.55),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.3),transparent_22%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-100 backdrop-blur">
              <Sparkles className="mr-2 h-4 w-4 text-accent" />
              Scenic itineraries, hotel controls, and smart trip configuration
            </div>
            <h1 className="display-font text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Plan mountain routes with a booking flow built around the
              itinerary.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
              The first pass focuses on a refined design-trip experience:
              configure the journey, review each day, then swap hotels, rooms,
              and vehicles without leaving the booking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/design-trip"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Design My Trip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/design-trip/astore-minimarg-001"
                className="pill-button border-white/20 bg-white/10 text-white hover:border-white/40 hover:text-white"
              >
                View Sample Itinerary
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">Signature routes</p>
              <p className="mt-3 display-font text-3xl">12</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">Editable stay choices</p>
              <p className="mt-3 display-font text-3xl">Hotel, room, vehicle</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-slate-300">Current build phase</p>
              <p className="mt-3 display-font text-3xl">Public trip flow</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
