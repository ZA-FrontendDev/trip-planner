"use client";

import Link from "next/link";
import { useState } from "react";

const destinations = ["Astore", "Naran", "Skardu", "Hunza"];
const departureCities = ["Islamabad", "Lahore", "Karachi"];
const roomTypes = ["Standard", "Deluxe", "Deluxe Double"];
const travelClasses = ["Economy", "Business"];
const vehicleTypes = ["Honda BRV", "Hiace", "Coaster", "Land Cruiser"];

export function TripForm() {
  const [bookingId] = useState("astore-minimarg-001");

  return (
    <div className="card-surface p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Design My Trip
        </p>
        <h2 className="display-font mt-3 text-3xl font-semibold text-ink">
          Trip configuration
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          This first version is a styled front-end flow using mock booking data.
          Form submission routes to the itinerary screen that matches the
          provided reference.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <input className="input-base" placeholder="Full Name" />
        <input
          className="input-base"
          type="email"
          placeholder="Email Address"
        />
        <input className="input-base" placeholder="WhatsApp / Phone" />
        <select className="input-base" defaultValue="">
          <option value="" disabled>
            Departure City
          </option>
          {departureCities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
        <select className="input-base" defaultValue="">
          <option value="" disabled>
            Destination
          </option>
          {destinations.map((destination) => (
            <option key={destination}>{destination}</option>
          ))}
        </select>
        <input className="input-base" type="date" />
        <input className="input-base" type="date" />
        <input
          className="input-base"
          type="number"
          min="1"
          defaultValue="4"
          placeholder="Adults"
        />
        <input
          className="input-base"
          type="number"
          min="0"
          defaultValue="0"
          placeholder="Children"
        />
        <select className="input-base" defaultValue="">
          <option value="" disabled>
            Room Type
          </option>
          {roomTypes.map((room) => (
            <option key={room}>{room}</option>
          ))}
        </select>
        <select className="input-base" defaultValue="">
          <option value="" disabled>
            Travel Class
          </option>
          {travelClasses.map((travelClass) => (
            <option key={travelClass}>{travelClass}</option>
          ))}
        </select>
        <select className="input-base" defaultValue="">
          <option value="" disabled>
            Vehicle Type
          </option>
          {vehicleTypes.map((vehicle) => (
            <option key={vehicle}>{vehicle}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <textarea
          className="textarea-base min-h-32"
          placeholder="Special requests, dietary notes, accessibility needs, or custom stopovers"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Next step in this phase: submit to Convex, create the booking, and
          resolve a matching package.
        </p>
        <Link
          href={`/design-trip/${bookingId}`}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          Preview Itinerary
        </Link>
      </div>
    </div>
  );
}
