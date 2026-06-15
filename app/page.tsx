import { Footer } from "@/components/site/footer";
import { HomePageClient } from "@/components/site/home-page-client";
import { Navbar } from "@/components/site/navbar";

export default function HomePage() {
  return (
    <main className="pb-8">
      <Navbar />
      <HomePageClient />
      <Footer />
    </main>
  );
}
