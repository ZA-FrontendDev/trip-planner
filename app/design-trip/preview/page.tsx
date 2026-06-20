import { Footer } from "@/components/site/footer";
import { BookingItineraryClient } from "@/components/site/booking-itinerary-client";
import { Navbar } from "@/components/site/navbar";
import type { TripRequestArgs } from "@/convex/lib/trip";

type PreviewPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? (value[0] ?? fallback) : (value ?? fallback);
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const params = await searchParams;
  const packageId = getValue(params.packageId);

  const previewRequest: TripRequestArgs = {
    packageId: packageId || undefined,
    customerName: getValue(params.customerName),
    customerEmail: getValue(params.customerEmail),
    customerPhone: getValue(params.customerPhone),
    departureCity: getValue(params.departureCity),
    destination: getValue(params.destination),
    startDate: getValue(params.startDate),
    endDate: getValue(params.endDate),
    adults: Number(getValue(params.adults, "1")),
    children: Number(getValue(params.children, "0")),
    roomType: getValue(params.roomType),
    travelClass: getValue(params.travelClass),
    vehicleType: getValue(params.vehicleType),
    specialRequests: getValue(params.specialRequests),
  };

  return (
    <main className="pb-8 pt-18">
      <Navbar />
      <section className="section-shell pt-8">
        <BookingItineraryClient previewRequest={previewRequest} />
      </section>
      <Footer />
    </main>
  );
}
