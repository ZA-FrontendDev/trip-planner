import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

export default function AboutPage() {
  return (
    <main className="pb-8">
      <Navbar />
      <section className="section-shell pt-8">
        <div className="card-surface p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">About</p>
          <h1 className="display-font mt-3 text-4xl font-semibold text-ink">Trip planning shaped around real routes.</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
            This implementation phase establishes the public website shell and the itinerary-first booking
            experience. The next layer is Convex-backed package management, admin builders, and live trip
            customization state.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
