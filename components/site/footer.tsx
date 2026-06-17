import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 bg-slate-950 px-[5%] py-16 text-white/60">
      <div className="mx-auto max-w-300">
        <div className="mb-12 grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="display-font text-[22px] font-bold text-white">
              Pak<span className="text-amber-500">Trips</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-7 text-white/55">
              Pakistan&apos;s most trusted trip planning platform for northern
              adventures. Curated itineraries, verified hotels, expert guides.
            </p>
          </div>

          <FooterColumn
            title="Destinations"
            links={[
              ["Hunza Valley", "#"],
              ["Skardu", "#"],
              ["Naran & Kaghan", "#"],
              ["Astore", "#"],
              ["Deosai Plains", "#"],
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              ["About Us", "/about"],
              ["Contact", "/contact"],
              ["Careers", "#"],
              ["Blog", "#"],
            ]}
          />
          <FooterColumn
            title="Contact"
            links={[
              ["+92 300 1234567", "#"],
              ["info@paktrips.pk", "#"],
              ["WhatsApp Us", "#"],
              ["Islamabad Office", "#"],
            ]}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 PakTrips. All rights reserved.</p>
          <p>Privacy Policy · Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<[string, string]>;
}) {
  return (
    <div>
      <p className="display-font mb-4 text-[13px] font-semibold uppercase tracking-[1px] text-white">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-white/50 transition hover:text-amber-400"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
