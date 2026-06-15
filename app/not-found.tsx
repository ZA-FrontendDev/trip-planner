import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section-shell flex min-h-screen items-center justify-center py-16">
      <div className="card-surface max-w-lg p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Not Found</p>
        <h1 className="display-font mt-3 text-4xl font-semibold text-ink">The trip record is not available yet.</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          This first build exposes a single sample booking to validate the itinerary design and route layout.
        </p>
        <Link
          href="/design-trip"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          Return to trip form
        </Link>
      </div>
    </main>
  );
}
