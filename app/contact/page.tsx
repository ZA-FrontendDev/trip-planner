import { ContactForm } from "@/components/site/contact-form";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

export default function ContactPage() {
  return (
    <main className="pb-8">
      <Navbar />
      <section className="section-shell pt-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="card-surface p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Contact</p>
            <h1 className="display-font mt-3 text-4xl font-semibold text-ink">Start with a route conversation.</h1>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Contact messages are stored in Convex so your admin team can follow up with travelers and convert them into bookings.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
