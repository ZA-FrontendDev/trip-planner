"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { BootstrapData } from "@/components/shared/bootstrap-data";

const destinationShowcase = [
  { name: "Hunza", count: "8 packages", tone: "from-[#1B4F72] to-[#85C1E9]" },
  { name: "Skardu", count: "6 packages", tone: "from-[#2C3E50] to-[#BDC3C7]" },
  { name: "Deosai", count: "5 packages", tone: "from-[#0B3D36] to-[#1abc9c]" },
  { name: "Astore", count: "4 packages", tone: "from-[#14532d] to-[#6ee7b7]" },
];

export function HomePageClient() {
  const homeData = useQuery(api.site.getHomeData);
  const featuredPackages = homeData?.featuredPackages ?? [];

  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[linear-gradient(135deg,#0a2e2b_0%,#0D7C6E_50%,#1a4a3a_100%)] pt-18">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.15),transparent_18%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.05)_45%,rgba(255,255,255,0.1)_100%)]" />

        <div className="relative mx-auto grid w-full max-w-30012 px-[5%] py-20 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/15 px-4 py-2 text-[12px] font-semibold uppercase tracking-[1px] text-amber-400">
              Pakistan&apos;s Northern Wonders
            </div>
            <h1 className="display-font max-w-xl text-[clamp(36px,5vw,64px)] font-bold leading-[1.08] tracking-[-1.5px] text-white">
              Discover the{" "}
              <span className="text-amber-400">Roof of the World</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-8 text-white/70">
              Curated, all-inclusive trips to Hunza, Skardu, Naran, Astore and
              beyond — from Islamabad to the highest mountain ranges on earth.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/design-trip"
                className="display-font inline-flex items-center gap-2 rounded-[10px] bg-amber-500 px-7 py-3.5 text-[15px] font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#E08B06]"
              >
                Design My Trip →
              </Link>
              <Link
                href="/about"
                className="rounded-[10px] border border-white/30 px-7 py-3.5 text-[15px] font-medium text-white transition hover:bg-white/10"
              >
                View Packages
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              <HeroStat number="2,400+" label="Trips Completed" />
              <HeroStat number="38" label="Destinations" />
              <HeroStat number="4.9★" label="Average Rating" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-7 shadow-[0_24px_48px_rgba(0,0,0,0.2)]">
            <p className="display-font mb-5 text-lg font-semibold text-slate-800">
              Plan Your Journey
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <SearchField label="From">
                <select className="select-base">
                  <option>Islamabad</option>
                  <option>Lahore</option>
                  <option>Karachi</option>
                  <option>Peshawar</option>
                </select>
              </SearchField>
              <SearchField label="Destination">
                <select className="select-base">
                  <option>Hunza Valley</option>
                  <option>Skardu</option>
                  <option>Naran</option>
                  <option>Astore</option>
                  <option>Deosai</option>
                </select>
              </SearchField>
              <SearchField label="Departure Date">
                <input
                  className="date-base"
                  type="date"
                  defaultValue="2026-06-15"
                />
              </SearchField>
              <SearchField label="Persons">
                <select className="select-base">
                  <option>2 Adults</option>
                  <option>3 Adults</option>
                  <option>4 Adults</option>
                  <option>5+ Adults</option>
                </select>
              </SearchField>
              <SearchField label="Duration" full>
                <select className="select-base">
                  <option>5 Days / 4 Nights</option>
                  <option>7 Days / 6 Nights</option>
                  <option>10 Days / 9 Nights</option>
                  <option>14 Days / 13 Nights</option>
                </select>
              </SearchField>
            </div>
            <Link
              href="/design-trip"
              className="display-font mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-4 py-3.5 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#085041]"
            >
              Search Available Packages
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-[5%] pt-24">
        <BootstrapData />
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-primary">
              Popular Packages
            </p>
            <h2 className="display-font text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.8px] text-slate-800">
              Handpicked Journeys
            </h2>
            <p className="mt-4 max-w-130 text-base leading-7 text-slate-500">
              Every package is curated by our local experts with hotels,
              transport and daily itineraries included.
            </p>
          </div>
          <Link
            href="/design-trip"
            className="text-sm font-semibold text-primary"
          >
            View all packages →
          </Link>
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          {featuredPackages.length ? (
            featuredPackages
              .slice(0, 3)
              .map((tripPackage: any, index: number) => (
                <article
                  key={tripPackage._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(13,124,110,0.12)]"
                >
                  <div
                    className={`relative h-50 bg-linear-to-br ${
                      index === 0
                        ? "from-[#1B4F72] to-[#85C1E9]"
                        : index === 1
                          ? "from-[#0B3D36] to-[#1abc9c]"
                          : "from-[#2C3E50] to-[#BDC3C7]"
                    }`}
                  >
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 to-transparent" />
                    <div className="absolute left-3.5 top-3.5 rounded-md bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-slate-950">
                      {index === 0
                        ? "BESTSELLER"
                        : index === 1
                          ? "POPULAR"
                          : "PREMIUM"}
                    </div>
                    <div className="absolute bottom-3.5 left-3.5 text-[13px] font-medium text-white">
                      📅 {tripPackage.durationDays} Days ·{" "}
                      {Math.max(tripPackage.durationDays - 1, 1)} Nights
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="display-font text-base font-semibold text-slate-900">
                      {tripPackage.title}
                    </h3>
                    <p className="mt-2 text-[13px] text-slate-500">
                      📍 {tripPackage.departureCity} → {tripPackage.destination}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-900">
                        {tripPackage.travelClass}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-900">
                        {tripPackage.maxPersons} persons max
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                      <div>
                        <p className="text-[11px] text-slate-500">Per person</p>
                        <p className="display-font text-xl font-bold text-primary">
                          PKR {tripPackage.basePrice.toLocaleString("en-PK")}{" "}
                          <span className="text-xs font-normal text-slate-400">
                            / person
                          </span>
                        </p>
                      </div>
                      <Link
                        href={`/design-trip?package=${tripPackage.slug}`}
                        className="rounded-lg bg-emerald-50 px-4 py-2 text-[13px] font-semibold text-emerald-900 transition hover:bg-primary hover:text-white"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </article>
              ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
              Loading package catalog...
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-300 px-[5%] py-24">
        <div className="rounded-3xl bg-slate-100 px-8 py-16 md:px-16">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-primary">
            Why PakTrips
          </p>
          <h2 className="display-font text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.8px] text-slate-800">
            Travel with confidence
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "100% Safe & Verified",
                "All hotels and operators are personally verified by our team for quality and safety standards.",
              ],
              [
                "24/7 Support",
                "Our local guides and support team are available around the clock throughout your journey.",
              ],
              [
                "Best Price Guarantee",
                "We match any lower price you find. Transparent pricing — no hidden fees, ever.",
              ],
              [
                "Flexible Bookings",
                "Change hotels, vehicles, or room types anytime before departure at no extra charge.",
              ],
            ].map(([title, desc]) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-emerald-50 text-xl text-primary">
                  ✦
                </div>
                <p className="display-font text-[15px] font-semibold text-slate-900">
                  {title}
                </p>
                <p className="mt-2 text-[13px] leading-6 text-slate-500">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-[5%] pb-12">
        <div className="mb-10">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-primary">
            Popular Destinations
          </p>
          <h2 className="display-font text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.8px] text-slate-800">
            Where the routes open up
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {destinationShowcase.map((item, index) => (
            <div
              key={item.name}
              className={`group relative overflow-hidden rounded-[14px] ${
                index === 0 ? "md:col-span-2 md:h-65" : "h-55"
              }`}
            >
              <div
                className={`h-full w-full bg-linear-to-br ${item.tone} transition duration-300 group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="display-font text-lg font-bold text-white">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-white/70">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-[5%] py-24 text-white">
        <div className="mx-auto max-w-300">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-amber-400">
            Traveler Reviews
          </p>
          <h2 className="display-font text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.8px]">
            What our travelers say
          </h2>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              [
                "Ahmed Khalid",
                "Lahore, Pakistan",
                "The Astore trip was beyond our expectations. Every hotel, every route, every stopover was perfectly organized. We felt completely looked after from day one.",
              ],
              [
                "Sara Raza",
                "Karachi, Pakistan",
                "Being able to customize the hotel and car right on the itinerary page was a game changer. We switched to a Land Cruiser last minute and it was seamless.",
              ],
              [
                "Faizan Ali",
                "Islamabad, Pakistan",
                "Third time booking with PakTrips. The Hunza package this year was their best yet. Incredible value and the local guides are absolutely brilliant people.",
              ],
            ].map(([name, location, quote]) => (
              <article
                key={name}
                className="rounded-2xl border border-white/10 bg-white/5 p-7"
              >
                <p className="mb-3 text-sm tracking-[2px] text-amber-400">
                  ★★★★★
                </p>
                <p className="text-sm leading-7 text-white/75">
                  &quot;{quote}&quot;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="display-font flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-white/40">{location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-[5%] py-24">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-[linear-gradient(135deg,#0D7C6E_0%,#085041_100%)] px-10 py-16 md:flex-row md:items-center md:px-16">
          <div>
            <h2 className="display-font text-[36px] font-bold tracking-[-0.8px] text-white">
              Ready to explore the North?
            </h2>
            <p className="mt-2 text-base text-white/70">
              Design your perfect Pakistan trip in under 3 minutes.
            </p>
          </div>
          <Link
            href="/design-trip"
            className="display-font rounded-[10px] bg-amber-500 px-8 py-4 text-base font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#E08B06]"
          >
            Design My Trip →
          </Link>
        </div>
      </section>
    </>
  );
}

function HeroStat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="display-font text-[28px] font-bold text-white">{number}</p>
      <p className="mt-1 text-[12px] uppercase tracking-[0.5px] text-white/50">
        {label}
      </p>
    </div>
  );
}

function SearchField({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`space-y-1.5 ${full ? "md:col-span-2" : ""}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
