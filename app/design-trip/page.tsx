import { DesignTripClient } from "@/components/site/design-trip-client";
import { Navbar } from "@/components/site/navbar";

export default function DesignTripPage() {
  return (
    <main>
      <Navbar />
      <div className="mt-[72px]">
        <DesignTripClient />
      </div>
    </main>
  );
}
