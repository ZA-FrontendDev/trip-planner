"use client";

import { useState } from "react";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

const subjects = [
  "Trip Planning",
  "Booking Help",
  "Hotel Query",
  "Pricing",
  "Group Tour",
  "Other",
];
const destinations = [
  "Hunza Valley",
  "Skardu",
  "Naran & Kaghan",
  "Astore",
  "Deosai Plains",
  "Minimarg",
  "Not sure yet",
];

export function ContactForm() {
  const submit = useMutation(api.contacts.submit);
  const [subject, setSubject] = useState(subjects[0]);
  const [destination, setDestination] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");

  if (status === "submitted") {
    return (
      <div className="rounded-[20px] border border-slate-200 bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-emerald-50 text-2xl text-primary">
          ✓
        </div>
        <h3 className="display-font mt-5 text-center text-[22px] font-bold text-slate-900">
          Message sent! 🎉
        </h3>
        <p className="mx-auto mt-3 max-w-md text-center text-sm leading-7 text-slate-500">
          Thank you for reaching out. Our team will get back to you within 2
          hours during business hours.
        </p>
      </div>
    );
  }

  return (
    <form
      className="rounded-[20px] border border-slate-200 bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("submitting");
        try {
          await submit({
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            phone: form.phone,
            message: `Subject: ${subject}\nDestination: ${destination || "Not selected"}\n\n${form.message}`,
          });
          setForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
          });
          setDestination("");
          setStatus("submitted");
        } catch {
          setStatus("error");
        }
      }}
    >
      <h2 className="display-font text-[22px] font-bold text-slate-900">
        Send us a message
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Fill out the form and our team will get back to you within 2 hours.
      </p>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold tracking-[0.3px] text-slate-900">
          What&apos;s this about?
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {subjects.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSubject(item)}
              className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                subject === item
                  ? "border-primary bg-emerald-50 text-primary"
                  : "border-slate-200 text-slate-500 hover:border-primary hover:bg-emerald-50 hover:text-primary"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4.5 md:grid-cols-2">
        <ContactField label="First Name">
          <input
            className="input-base bg-slate-50 focus:bg-white"
            placeholder="Ahmed"
            value={form.firstName}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                firstName: event.target.value,
              }))
            }
            required
          />
        </ContactField>
        <ContactField label="Last Name">
          <input
            className="input-base bg-slate-50 focus:bg-white"
            placeholder="Khan"
            value={form.lastName}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                lastName: event.target.value,
              }))
            }
            required
          />
        </ContactField>
      </div>

      <div className="mt-4.5 grid gap-4.5 md:grid-cols-2">
        <ContactField label="Email Address">
          <input
            className="input-base bg-slate-50 focus:bg-white"
            type="email"
            placeholder="ahmed@email.com"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            required
          />
        </ContactField>
        <ContactField label="Phone / WhatsApp">
          <input
            className="input-base bg-slate-50 focus:bg-white"
            placeholder="+92 300 0000000"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
            required
          />
        </ContactField>
      </div>

      <div className="mt-4.5">
        <ContactField label="Destination of Interest">
          <select
            className="select-base bg-slate-50 focus:bg-white"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          >
            <option value="">Select destination...</option>
            {destinations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </ContactField>
      </div>

      <div className="mt-4.5">
        <ContactField label="Your Message">
          <textarea
            className="textarea-base min-h-30 bg-slate-50 focus:bg-white"
            placeholder="Tell us about your trip idea, dates, group size, or any questions you have..."
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            required
          />
        </ContactField>
      </div>

      <button
        type="submit"
        className="display-font mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#085041]"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
      <p className="mt-4 text-center text-xs text-slate-500">
        By submitting, you agree to our{" "}
        <span className="text-primary">Privacy Policy</span>. We never share
        your data.
      </p>
      {status === "error" ? (
        <p className="mt-3 text-center text-sm text-rose-600">
          Unable to send your message right now.
        </p>
      ) : null}
    </form>
  );
}

function ContactField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold tracking-[0.3px] text-slate-900">
        {label}
      </span>
      {children}
    </label>
  );
}
