import Link from "next/link";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

const team = [
  [
    "Zaid Amir",
    "Founder & CEO",
    "Hiked K2 base camp 4 times. Built PakTrips after his 7th northern trip in 2019.",
    "from-[#0D7C6E] to-[#085041]",
    "ZA",
  ],
  [
    "Nadia Baig",
    "Head of Operations",
    "Ex-PTDC. Manages all hotel partnerships and ground operations across Gilgit-Baltistan.",
    "from-[#1A6B8A] to-[#0D4E6A]",
    "NB",
  ],
  [
    "Asif Hussain",
    "Lead Mountain Guide",
    "15 years guiding treks in Karakoram. Speaks Shina, Balti, and English fluently.",
    "from-[#7D3C98] to-[#5B2C6F]",
    "AH",
  ],
  [
    "Sana Rehman",
    "Customer Experience",
    "Makes sure every traveler feels supported before, during, and after their trip.",
    "from-[#D35400] to-[#A04000]",
    "SR",
  ],
];

const values = [
  [
    "01",
    "Transparency above all",
    "Every price is final. No hidden charges, no surprise fees. You see exactly what you pay for before you book.",
  ],
  [
    "02",
    "Local-first approach",
    "We hire locally, partner with community-owned hotels, and ensure your money stays in northern Pakistan.",
  ],
  [
    "03",
    "Safety without compromise",
    "Every route, hotel, and operator we work with is personally inspected by our team at least twice a year.",
  ],
  [
    "04",
    "Flexibility built in",
    "Your trip, your choices. Change hotels, vehicles, or room types anytime — no penalties, no friction.",
  ],
  [
    "05",
    "Responsible tourism",
    "We support leave-no-trace principles and work with local conservation groups across all destinations.",
  ],
  [
    "06",
    "Relentless improvement",
    "We read every review, visit every hotel, and update our itineraries every season based on real traveler feedback.",
  ],
];

export default function AboutPage() {
  return (
    <main className="bg-white pb-0">
      <Navbar />

      <section className="relative mt-18 overflow-hidden bg-[linear-gradient(135deg,#0a2e2b_0%,#0D7C6E_100%)] px-[5%] py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_32%)]" />
        <div className="relative">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-amber-400">
            Our Story
          </p>
          <h1 className="display-font text-[clamp(32px,5vw,56px)] font-bold tracking-[-1px] text-white">
            Born from a love of the North
          </h1>
          <p className="mx-auto mt-4 max-w-140 text-[17px] leading-8 text-white/70">
            We started PakTrips because we believe Pakistan&apos;s mountains
            deserve to be experienced by every Pakistani — not just those with
            connections.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-300 gap-16 px-[5%] py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-primary">
            Who We Are
          </p>
          <h2 className="display-font text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.8px] text-slate-900">
            Pakistan&apos;s mountains are our home
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-8 text-slate-500">
            <p>
              PakTrips was founded in 2019 by a group of Islamabad-based
              travelers who were frustrated by how hard it was to plan a proper
              northern Pakistan trip without knowing the right people. Hotels
              were unreliable, guides were unvetted, and every trip felt like a
              gamble.
            </p>
            <p>
              We built a platform that puts the entire planning process in your
              hands — curated, transparent, and fully customizable — while our
              local team handles everything on the ground.
            </p>
            <p>
              Today, we&apos;ve helped over 2,400 families and groups explore
              Hunza, Skardu, Astore, Deosai, and beyond. Every package is
              personally verified by our team before it goes live.
            </p>
          </div>
          <div className="mt-7 flex items-center gap-4 border-t border-slate-200 pt-7">
            <div className="display-font flex h-13 w-13 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
              ZA
            </div>
            <div>
              <p className="display-font text-[15px] font-semibold text-slate-900">
                Zaid Amir
              </p>
              <p className="text-xs text-slate-500">Founder & CEO, PakTrips</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[20px]">
            <div className="h-95 w-full bg-[linear-gradient(180deg,#0D4E4A_0%,#0D7C6E_100%)]" />
          </div>
          <div className="absolute -bottom-5 -right-5 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
            <p className="display-font text-[32px] font-bold text-primary">
              2019
            </p>
            <p className="text-xs text-slate-500">Founded in Islamabad</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-[5%] py-20">
        <div className="mx-auto grid max-w-300 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["2,400+", "Trips Completed"],
            ["38", "Destinations"],
            ["96%", "Satisfaction Rate"],
            ["120+", "Partner Hotels"],
          ].map(([num, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 px-5 py-8 text-center"
            >
              <p className="display-font text-[44px] font-bold text-amber-400">
                {num}
              </p>
              <p className="mt-2 text-[13px] uppercase tracking-[1px] text-white/50">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-300 px-[5%] py-24">
        <div className="mb-14">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-primary">
            The Team
          </p>
          <h2 className="display-font text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.8px] text-slate-900">
            People behind your journey
          </h2>
          <p className="mt-4 max-w-130 text-base leading-7 text-slate-500">
            Local experts, experienced guides, and passionate travelers who know
            northern Pakistan like the back of their hand.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {team.map(([name, role, desc, tone, initials]) => (
            <article
              key={name}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,124,110,0.1)]"
            >
              <div
                className={`display-font flex h-50 items-center justify-center bg-linear-to-br ${tone} text-5xl font-bold text-white`}
              >
                {initials}
              </div>
              <div className="p-4.5">
                <h3 className="display-font text-[15px] font-semibold text-slate-900">
                  {name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.5px] text-primary">
                  {role}
                </p>
                <p className="mt-3 text-xs leading-6 text-slate-500">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-300 px-[5%] pb-24">
        <div className="rounded-3xl bg-slate-100 px-8 py-18 md:px-16">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-primary">
            Our Values
          </p>
          <h2 className="display-font text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.8px] text-slate-900">
            What we stand for
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {values.map(([num, title, desc]) => (
              <div key={title}>
                <p className="display-font text-[42px] font-bold leading-none text-primary/15">
                  {num}
                </p>
                <h3 className="display-font mt-2 text-[17px] font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-[5%] pb-24">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-[linear-gradient(135deg,#0D7C6E_0%,#085041_100%)] px-10 py-18 md:flex-row md:items-center">
          <div>
            <h2 className="display-font text-[32px] font-bold tracking-[-0.5px] text-white">
              Let&apos;s plan your trip together
            </h2>
            <p className="mt-2 text-[15px] text-white/70">
              Design a custom itinerary in minutes. No calls required.
            </p>
          </div>
          <Link
            href="/design-trip"
            className="display-font rounded-[10px] bg-amber-500 px-7 py-3.5 text-[15px] font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#E08B06]"
          >
            Design My Trip →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
