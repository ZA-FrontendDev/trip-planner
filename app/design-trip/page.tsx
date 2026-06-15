import { DesignTripClient } from "@/components/site/design-trip-client";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

export default function DesignTripPage() {
  return (
    <main className="pb-8">
      <Navbar />
      <section className="section-shell pt-8">
        <DesignTripClient />
      </section>
      <Footer />
    </main>
  );
}
