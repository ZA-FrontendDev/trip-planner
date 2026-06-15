"use client";

import { useState } from "react";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const submit = useMutation(api.contacts.submit);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");

  return (
    <form
      className="card-surface p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("submitting");
        try {
          await submit(form);
          setForm({ name: "", email: "", phone: "", message: "" });
          setStatus("submitted");
        } catch {
          setStatus("error");
        }
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="input-base"
          placeholder="Name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <input
          className="input-base"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <input
          className="input-base md:col-span-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          required
        />
        <textarea
          className="textarea-base min-h-40 md:col-span-2"
          placeholder="Message"
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          required
        />
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {status === "submitted" ? "Your message has been saved in Convex." : "Contact leads are stored in the backend."}
        </p>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending..." : "Send message"}
        </Button>
      </div>
    </form>
  );
}
