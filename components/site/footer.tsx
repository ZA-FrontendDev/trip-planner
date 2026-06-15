export function Footer() {
  return (
    <footer className="section-shell pb-8 pt-12">
      <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-slate-200/70 bg-slate-950 px-6 py-8 text-slate-200 shadow-soft md:flex-row md:items-center">
        <div>
          <p className="display-font text-xl">Designed for northern Pakistan journeys.</p>
          <p className="mt-2 text-sm text-slate-400">
            Next.js and Convex-ready scaffolding with itinerary-first booking UX.
          </p>
        </div>
        <p className="text-sm text-slate-400">Phase 1 implementation in progress.</p>
      </div>
    </footer>
  );
}
