import { Footer } from "@/components/site/footer";
import { BookingItineraryClient } from "@/components/site/booking-itinerary-client";
import { Navbar } from "@/components/site/navbar";

type BookingPageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { bookingId } = await params;

  return (
    <main className="pb-8">
      <Navbar />
      <section className="section-shell pt-8">
        <BookingItineraryClient bookingId={bookingId} />
      </section>
      <Footer />
    </main>
  );
}
