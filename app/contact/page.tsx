import { ContactForm } from "@/components/site/contact-form";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

const faqs = [
  [
    "How far in advance should I book?",
    "We recommend booking at least 3–4 weeks in advance, especially for peak season (June–August). Some popular packages like Hunza and Deosai fill up 6–8 weeks ahead. You can also enquire with us for last-minute availability.",
  ],
  [
    "Can I customize the package after booking?",
    "Yes. You can change hotels, room types, and vehicles anytime before departure through your trip page. Our team will confirm availability and update your total price accordingly.",
  ],
  [
    "Is the price per person or for the group?",
    "All prices listed on the platform are per person, based on the number of travelers you enter. The total at checkout reflects the full group cost.",
  ],
  [
    "What is your cancellation policy?",
    "Cancellations made 14+ days before departure receive a full refund. 7–14 days: 50% refund. Less than 7 days: no refund, but we can reschedule your trip at no charge.",
  ],
  [
    "Do you arrange flights or just road trips?",
    "All our packages are road trip based, departing from Islamabad. We can assist with domestic flight bookings as an add-on for an additional fee.",
  ],
];

export default function ContactPage() {
  return (
    <main className="bg-white pb-0">
      <Navbar />

      <section className="relative mt-18 overflow-hidden bg-[linear-gradient(135deg,#0a2e2b_0%,#0D7C6E_100%)] px-[5%] py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_32%)]" />
        <div className="relative">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-amber-400">
            Get in Touch
          </p>
          <h1 className="display-font text-[clamp(32px,5vw,56px)] font-bold tracking-[-1px] text-white">
            We&apos;re here to help
          </h1>
          <p className="mx-auto mt-4 max-w-130 text-[17px] leading-8 text-white/70">
            Have a question about a package or need help planning? Our team
            responds within 2 hours during business hours.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-300 gap-16 px-[5%] py-20 lg:grid-cols-[1fr_1.6fr]">
        <div className="space-y-7">
          <InfoCard
            label="Phone"
            value="+92 300 1234567"
            sub="Mon–Sat, 9am – 8pm PKT"
            icon="☎"
          />
          <InfoCard
            label="Email"
            value="info@paktrips.pk"
            sub="We reply within 2 hours"
            icon="✉"
          />
          <InfoCard
            label="Office"
            value="F-7 Markaz, Islamabad"
            sub="Open for walk-ins Mon–Sat"
            icon="⌂"
          />

          <a
            href="https://wa.me/923001234567"
            className="display-font flex items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1DB954]"
          >
            Chat on WhatsApp
          </a>

          <div className="rounded-2xl bg-slate-950 p-7">
            <h2 className="display-font text-[15px] font-semibold text-white">
              ⏰ Office Hours
            </h2>
            <div className="mt-5 space-y-0.5">
              {[
                ["Monday – Friday", "9:00 AM – 8:00 PM"],
                ["Saturday", "10:00 AM – 6:00 PM"],
                ["Sunday", "Closed"],
                ["Public Holidays", "WhatsApp Only"],
              ].map(([day, time], index) => (
                <div
                  key={day}
                  className={`flex items-center justify-between py-3 ${index < 3 ? "border-b border-white/10" : ""}`}
                >
                  <span className="text-[13px] text-white/50">{day}</span>
                  <span
                    className={`text-[13px] font-semibold ${time === "Closed" ? "text-white" : time.includes("AM") ? "text-emerald-400" : "text-white"}`}
                  >
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ContactForm />
      </section>

      <section className="mx-auto max-w-300 px-[5%] pb-24">
        <h2 className="display-font mb-5 text-xl font-semibold text-slate-900">
          📍 Find our office
        </h2>
        <div className="overflow-hidden rounded-[20px] border border-slate-200">
          <div className="h-100 w-full bg-[linear-gradient(180deg,#E8F0E8_0%,#D5E8D5_100%)]" />
        </div>
      </section>

      <section className="bg-slate-100 px-[5%] py-20">
        <div className="mx-auto max-w-180">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-primary">
            FAQ
          </p>
          <h2 className="display-font text-[clamp(26px,4vw,36px)] font-bold tracking-[-0.5px] text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-3">
            {faqs.map(([question, answer], index) => (
              <details
                key={question}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                open={index === 0}
              >
                <summary className="display-font cursor-pointer list-none px-6 py-5 text-[15px] font-semibold text-slate-900">
                  {question}
                </summary>
                <p className="px-6 pb-5 text-sm leading-7 text-slate-500">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function InfoCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: string;
}) {
  return (
    <div className="flex gap-4.5 rounded-2xl bg-slate-100 p-7 transition hover:shadow-[0_8px_28px_rgba(13,124,110,0.1)]">
      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-emerald-50 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[1px] text-slate-500">
          {label}
        </p>
        <p className="display-font mt-1 text-[15px] font-semibold text-slate-900">
          {value}
        </p>
        <p className="mt-1 text-[13px] text-slate-500">{sub}</p>
      </div>
    </div>
  );
}
