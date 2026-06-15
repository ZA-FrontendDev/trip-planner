import Link from "next/link";
import { Compass, MapPinned } from "lucide-react";

export function Navbar() {
  return (
    <header className="section-shell pt-6">
      <div className="card-surface flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="display-font text-lg font-semibold tracking-tight text-ink">
              Pakistan Trip Planner
            </p>
            <p className="text-xs text-slate-500">Curated northern routes with editable itineraries</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/design-trip" className="pill-button">
            <MapPinned className="mr-2 h-4 w-4" />
            Design My Trip
          </Link>
        </nav>
      </div>
    </header>
  );
}
